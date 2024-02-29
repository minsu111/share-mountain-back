const PostModel = require('../db/models/postModel.js');

class PostService {
  async getAllPosts() {
    return await PostModel.findAllPosts();
  }

  async getTestPost() {
    return await PostModel.findTest();
  }
}

const postService = new PostService(PostModel);
module.exports = postService;
