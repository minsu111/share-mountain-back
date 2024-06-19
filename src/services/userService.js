const userModel = require('../db/models/userModel.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwt');

/**
 * 로그인 판단 로직
 */
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

  /**
   * 로그인 - session 이용
   */
  // async getUserToken(loginInfo, res, next) {
  //   return passport.authenticate('local', (error, user, info) => {
  //     if (error) return res.status(500).json(error);
  //     if (!user) return res.status(401).json(info.message);
  //     loginInfo.logIn(user, (err) => {
  //       if (err) return next(err);
  //       res.redirect('http://localhost:5173/home');
  //     });
  //   })(loginInfo, res, next);
  // }

  /**
   * 로그인 - jwt 이용
   */

  async login(loginInfo, res) {
    const { userId, password } = loginInfo;

    const user = await userModel.findByEmail(userEmail);

    if (!user) {
      throw new Error('가입되지 않은 아이디 입니다.');
    }

    // 비밀번호 일치 여부 확인
    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    // 토큰 페이로드 정보 생성
    const payload = {
      userId: user.userId,
    };

    const token = generateToken(payload);

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.json({ message: '성공적으로 로그인 되었습니다.', user, token });
  }

  logout(req, res) {
    const token = req.cookies.token;

    if (!token) {
      res
        .status(400)
        .json({ message: '토큰이 없습니다. 로그인 상태를 확안하세요.' });
      return;
    }

    const decoded = jwt.decode(token);

    if (!decoded) {
      res
        .status(401)
        .json({ message: '잘못된 토큰입니다. 로그인 상태를 확인하세요.' });
      return;
    }

    res.clearCookie('token');
    res.json({ message: '로그아웃 되었습니다.' });
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
    res.send('가입성공');
    // res.redirect('http://localhost:5173/home');
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
