const { Router } = require('express');
const PostService = require('../services/postService.js');

const PostRouter = Router();

// PostRouter.get('/posts', async (req, res, next) => {
//   try {
//     const result = await PostService.getAllPosts();
//     if (!result) {
//       return res.status(404).json({ error: 'not found' });
//     }
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// });

PostRouter.get('/posts', async (req, res, next) => {
  try {
    const result = await PostService.getAllPosts();
    if (!result) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = PostRouter;
