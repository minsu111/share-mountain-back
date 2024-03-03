const postModel = require('../db/models/postModel.js');

class PostService {
  async getAllPosts() {
    return await postModel.findAllPosts();
  }

  async getTestPost() {
    return await postModel.findTest();
  }
}

const postService = new PostService(postModel);
module.exports = postService;
