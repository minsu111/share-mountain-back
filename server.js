const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(express.json());
const cors = require('cors');
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

app.use(passport.initialize());
app.use(
  session({
    secret: '암호화에 쓸 비번',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(passport.session());

// 아이디, 비번 일치여부 판단 로직
passport.use(
  new LocalStrategy(async (id, pw, cb) => {
    try {
      let result = await db.collection('users').findOne({ userName: id });
      if (!result) {
        return cb(null, false, { message: '아이디 DB에 없음' });
      }
      if (result.password == pw) {
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

const { MongoClient, ObjectId } = require('mongodb');

let db;
const url = process.env.DB_URL;
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log('DB연결성공');
    db = client.db('share-mountain');
    app.listen(process.env.PORT, function () {
      console.log('listening on 8080');
    });
  })
  .catch((err) => {
    console.log(err);
  });

const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'sharemountain1',
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

app.post('/addMountain', upload.single('img1'), async (req, res) => {
  try {
    if (
      req.body.mountain_name == '' ||
      req.body.mountain_level == '' ||
      req.body.mountain_address == ''
    ) {
      res.send('정보를 모두 입력해주세요.');
    } else {
      //  const mountainId = await autoIncObjectId('mountainId');
      // const mountainId = mountainIdCounter++;
      await db.collection('mountain').insertOne({
        mountainName: req.body.mountain_name,
        mountainLevel: req.body.mountain_level,
        mountainAddress: req.body.mountain_address,
        mountainImgURL: req.file.location,
        createDate: new Date(),
      });
      res.redirect('http://localhost:5173/home');
    }
  } catch (e) {
    res.status(500).send('에러가 발생했습니다.');
  }
});

app.get('/mountain/:id', async (req, res, next) => {
  try {
    // const mountainId = Number(req.params.mountainId);

    const result = await db
      .collection('mountain')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!result) {
      return res.status(404).json({ error: 'Mountain not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/mountain/:id/posts', async (req, res, next) => {
  try {
    const mountainNameData = await db
      .collection('mountain')
      .findOne({ _id: new ObjectId(req.params.id) });

    const result = await db
      .collection('posts')
      .find({ mountainName: mountainNameData.mountainName });

    if (!result) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/mountain', async (req, res, next) => {
  try {
    const result = await db.collection('mountain').find().toArray();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post(
  '/addPost/:selectedMountain',
  upload.array('img2', 5),
  async (req, res, next) => {
    try {
      const fileLocations = req.files.map((file) => file.location);

      const currentDate = new Date();
      const formattedHours =
        currentDate.getHours() < 10
          ? '0' + currentDate.getHours()
          : currentDate.getHours();
      const formattedMinutes =
        currentDate.getMinutes() < 10
          ? '0' + currentDate.getMinutes()
          : currentDate.getMinutes();

      const formattedDate = `${
        currentDate.getMonth() + 1
      }월 ${currentDate.getDate()}일 ${formattedHours}:${formattedMinutes}`;

      if (req.body.post_text == '') {
        res.send('정보를 모두 입력해주세요.');
      } else {
        await db.collection('posts').insertOne({
          userNickName: '엄홍민수(test)',
          postImg: fileLocations,
          postBody: req.body.post_text,
          postDate: formattedDate,
          mountainName: req.params.selectedMountain,
        });
        console.log(req.body);
        res.redirect('http://localhost:5173/home');
      }
    } catch (error) {
      next(error);
    }
  }
);

app.get('/posts', async (req, res, next) => {
  try {
    const posts = await db.collection('posts').find().toArray();

    const result = await Promise.all(
      posts.map(async (post) => {
        const mountainInfo = await db
          .collection('mountain')
          .findOne({ mountainName: post.mountainName });
        return {
          userNickName: post.userNickName,
          postImg: post.postImg,
          postBody: post.postBody,
          postDate: post.postDate,
          mountainInfo: mountainInfo || null,
        };
      })
    );
    if (!result) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/search/:searchKeyWord', async (req, res) => {
  let searchConditions = [
    {
      $search: {
        index: 'mountainName_index',
        text: { query: req.params.searchKeyWord, path: 'mountainName' },
      },
    },
  ];
  let result = await db
    .collection('mountain')
    .aggregate(searchConditions)
    .toArray();
  res.json(result);
  console.log(req.params.searchKeyWord);
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
