const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const corsOptions = {
  origin: true,
  credentials: true,
};

const bcrypt = require('bcrypt');

const postRouter = require('./src/routes/postRouter.js');
const mountainRouter = require('./src/routes/mountainRouter.js');

app.use(express.json());
const cors = require('cors');
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use('/post', postRouter);
app.use('/mountain', mountainRouter);

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const MongoStore = require('connect-mongo');

mongoose.connect(process.env.DB_URL, {
  dbName: 'share-mountain',
});

mongoose.connection.on('connected', () =>
  console.log('정상적으로 MongoDB에 연결되었습니다.')
);

app.listen(process.env.PORT, function () {
  console.log('listening on 8080');
});

app.use(passport.initialize());
app.use(
  session({
    secret: '암호화에 쓸 비번',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      dbName: 'share-mountain',
    }),
  })
);
app.use(passport.session());

// 아이디, 비번 일치여부 판단 로직
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

// 로그인
app.post('/login', async (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return res.status(500).json(error);
    if (!user) return res.status(401).json(info.message);
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect('http://localhost:5173/home');
    });
  })(req, res, next);
});

// 회원가입
app.post('/signup', async (req, res) => {
  try {
    let hash = await bcrypt.hash(req.body.password, 10);
    await db.collection('users').insertOne({
      emailId: req.body.email_id,
      userName: req.body.username,
      nickName: req.body.nickname,
      password: hash,
    });
    res.redirect('http://localhost:5173/home');
  } catch (e) {
    console.log('가입 실패');
  }
});

// 이메일 아이디 중복 체크
app.get('/emailCheck/:emailId', async (req, res) => {
  const userId = await db
    .collection('users')
    .findOne({ emailId: req.params.emailId });

  console.log(req.params.emailId);

  if (userId) {
    res.send('isDuplicated');
  } else {
    res.send('isNotDuplicated');
  }
});

// 닉네임 중복 체크
app.get('/nicknameCheck/:nickname', async (req, res) => {
  const userId = await db
    .collection('users')
    .findOne({ nickName: req.params.nickname });

  console.log(req.params.nickname);

  if (userId) {
    res.send('isDuplicated');
  } else {
    res.send('isNotDuplicated');
  }
});
+(
  // 유저 정보 조회
  app.get('/user', async (req, res, next) => {})
);
