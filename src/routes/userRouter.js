const { Router } = require('express');
const userService = require('../services/userService.js');
const asyncHandler = require('../middlewares/asyncHandler.js');
// const upload = require('../middlewares/imageUploadHandler.js');

const userRouter = Router();

// userRouter.post(
//   '/login',
//   asyncHandler(async (req, res, next) => {
//     return await userService.getUserToken(req.body, res, next);
//   })
// );

/**
 * 로그인 라우터
 */
userRouter.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    return await userService.login(req.body, res, next);
  })
);

/**
 * 로그아웃 라우터
 */
userRouter.post('/logout', (req, res, next) => {
  try {
    userService.logout(req, res, next);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.post('/signup', async (req, res, next) => {
  try {
    await userService.addNewUser(req.body, res);
  } catch (err) {
    next(err);
  }
});

userRouter.get('/emailCheck/:emailId', async (req, res, nextTick) => {
  try {
    const userEmail = await userService.checkEmailId(req.params.emailId);
    if (userEmail) {
      res.send('isDuplicated');
    } else {
      res.send('isNotDuplicated');
    }
  } catch (err) {
    next(err);
  }
});

userRouter.get('/nicknameCheck/:nickname', async (req, res, next) => {
  try {
    const userNickName = await userService.checkNickName(req.params.nickname);
    if (userNickName) {
      res.send('isDuplicated');
    } else {
      res.send('isNotDuplicated');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
