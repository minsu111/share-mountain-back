const { Router } = require('express');
const postService = require('../services/postService.js');
const asyncHandler = require('../middlewares/asyncHandler.js');
const upload = require('../middlewares/imageUploadHandler.js');

const postRouter = Router();

postRouter.get(
  '/posts',
  asyncHandler(async (req, res, next) => {
    const result = await postService.getAllPosts();
    res.json(result);
  })
);

postRouter.get(
  '/:mountainName',
  asyncHandler(async (req, res, next) => {
    const result = await postService.getMountainPosts(req.params.mountainName);
    res.json(result);
  })
);

postRouter.post(
  '/add/:selectedMountain',
  upload.array('img2', 5),
  asyncHandler(async (req, res, next) => {
    const selectedMountain = req.params.selectedMountain;
    await postService.addMountainPost(req, selectedMountain);
    if (req.body.post_text == '' || req.files.length === 0) {
      res.send('정보를 모두 입력해주세요.');
    }
    res.redirect('http://localhost:5173/home');
  })
);

module.exports = postRouter;
