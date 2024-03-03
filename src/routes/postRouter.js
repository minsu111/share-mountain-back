const { Router } = require('express');
const postService = require('../services/postService.js');

const postRouter = Router();

// postRouter.get('/posts', async (req, res, next) => {
//   try {
//     const result = await postService.getAllPosts();
//     if (!result) {
//       return res.status(404).json({ error: 'not found' });
//     }
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// });

postRouter.get('/posts', async (req, res, next) => {
  try {
    const result = await postService.getAllPosts();
    if (!result) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = postRouter;
