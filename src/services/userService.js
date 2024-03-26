const userModel = require('../db/models/userModel.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(
  new LocalStrategy(async (id, pw, cb) => {
    try {
      let result = await db.collection('users').findOne({ emailId: id });
      if (!result) {
        return cb(null, false, { message: '아이디 DB에 없음' });
      }
      if (await bcrypt.compare(pw, result.password)) {
        return cb(null, result);
      } else {
        return cb(null, false, { message: '비번불일치' });
      }
    } catch (error) {
      res.status(500).send('에러가 발생했습니다.');
    }
  })
);

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, username: user.userName });
  });
});

passport.deserializeUser(async (user, done) => {
  let result = await db
    .collection('users')
    .findOne({ _id: new ObjectId(user.id) });
  delete result.password;
  process.nextTick(() => {
    done(null, result);
  });
});

class UserService {
  // 아이디, 비밀번호 일치하는지 확인
  // 로그인
  async getUserToken(loginInfo, res, next) {
    return passport.authenticate('local', (error, user, info) => {
      if (error) return res.status(500).json(error);
      if (!user) return res.status(401).json(info.message);
      loginInfo.logIn(user, (err) => {
        if (err) return next(err);
        res.redirect('http://localhost:5173/home');
      });
    })(loginInfo, res, next);
  }
  // 회원가입
  async addNewUser(userInfo, res) {
    let hash = await bcrypt.hash(userInfo.password, 10);
    await userModel.createUser({
      emailId: userInfo.email_id,
      userName: userInfo.username,
      nickName: userInfo.nickname,
      password: hash,
    });
    res.send('가입완료');
  }
  // 회원가입 -> 이메일 아이디 중복 확인
  async checkEmailId(email) {
    return await userModel.findByEmail(email);
  }
  // 회원가입 -> 닉네임 중복 확인
  async checkNickName(nickname) {
    return await userModel.findByNickName(nickname);
  }
}

const userService = new UserService(userModel);
module.exports = userService;
