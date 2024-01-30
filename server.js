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

//let mountainIdCounter = 1;

// let autoIncObjectId = async (seqName) => {
//   let result = await db
//     .collection('counters')
//     .findOneAndUpdate(
//       { _id: seqName },
//       { $inc: { seq_value: 1 } },
//       { returnDocument: 'after' }
//     );
//   return result.value.seq_value;
// };

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
      });
      res.redirect('http://localhost:5173/home');
    }
  } catch (e) {
    console.log(e);
    res.status(500).send('에러가 발생했습니다.');
  }
});

app.get('/mountain/:id', async (req, res, next) => {
  try {
    // const mountainId = Number(req.params.mountainId);
    const result = await db
      .collection('mountain')
      .findOne({ _id: new ObjectId(req.params.id) });

    console.log(result);

    if (!result) {
      return res.status(404).json({ error: 'Mountain not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/mountain', async (req, res, next) => {
  try {
    const result = await db.collection('mountain').find().toArray();
    console.log(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post('/addPost', upload.array('img2', 5), async (req, res, next) => {
  try {
    const fileLocations = req.files.map((file) => file.location);
    // const mountainInfo = await db
    //   .collection('mountain')
    //   .findOne({ _id: new ObjectId(req.body.select_mountain) });
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
        mountainId: req.body.select_mountain,
      });
      console.log(req.files);
    }
  } catch (error) {
    next(error);
  }
});

app.get('/posts', async (req, res, next) => {
  try {
    const result = await db.collection('posts').find().toArray();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, '/react-project/build/index.html'));
// });
