const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const app = express();
// const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const corsOptions = {
  origin: true,
  credentials: true,
};

// const bcrypt = require('bcrypt');

const postRouter = require('./src/routes/postRouter.js');
const mountainRouter = require('./src/routes/mountainRouter.js');
const userRouter = require('./src/routes/userRouter.js');

app.use(express.json());
const cors = require('cors');
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use('/post', postRouter);
app.use('/mountain', mountainRouter);
app.use('/user', userRouter);

const session = require('express-session');
const passport = require('passport');
// const LocalStrategy = require('passport-local');

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

// 로그인
// app.post('/login', async (req, res, next) => {
//   passport.authenticate('local', (error, user, info) => {
//     if (error) return res.status(500).json(error);
//     if (!user) return res.status(401).json(info.message);
//     req.logIn(user, (err) => {
//       if (err) return next(err);
//       res.redirect('http://localhost:5173/home');
//     });
//   })(req, res, next);
// });

// 회원가입
// app.post('/signup', async (req, res) => {
//   try {
//     let hash = await bcrypt.hash(req.body.password, 10);
//     await db.collection('users').insertOne({
//       emailId: req.body.email_id,
//       userName: req.body.username,
//       nickName: req.body.nickname,
//       password: hash,
//     });
//   } catch (e) {
//     console.log('가입 실패');
//   }
// });

//   // 유저 정보 조회
//   app.get('/user', async (req, res, next) => {})
// );
