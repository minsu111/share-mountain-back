const { Router } = require('express');
const userService = require('../services/userService.js');
const asyncHandler = require('../middlewares/asyncHandler.js');
// const upload = require('../middlewares/imageUploadHandler.js');

const userRouter = Router();

userRouter.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    return await userService.getUserToken(req.body, res, next);
  })
);

userRouter.post('/signup', async (req, res, next) => {
  await userService.addNewUser(req.body, res);
  console.log(req.body);
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
