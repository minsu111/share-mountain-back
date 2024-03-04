const { model } = require('mongoose');
const PostSchema = require('../schemas/postSchema.js');

const Post = model('posts', PostSchema);

class PostModel {
  async findAllPosts() {
    return await Post.find({});
  }

  async findMountainPosts(mountainName) {
    return await Post.find({ mountainName: mountainName });
  }

  async createPost(post) {
    return await Post.create(post);
  }
}
const postModel = new PostModel();
module.exports = postModel;
