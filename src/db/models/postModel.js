const { model } = require('mongoose');
const PostSchema = require('../schemas/postSchema.js');

const Post = model('posts', PostSchema);

class PostModel {
  async findAllPosts() {
    return await Post.find({});
  }

  async findTest() {
    return await Post.findOne({ _id: '65c1c420e1670bad65294d15' });
  }
}
const postModel = new PostModel();
module.exports = postModel;
