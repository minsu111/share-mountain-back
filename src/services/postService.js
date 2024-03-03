const postModel = require('../db/models/postModel.js');
const mountainModel = require('../db/models/mountainModel.js');

class PostService {
  async getAllPosts() {
    const posts = await postModel.findAllPosts();

    const result = await Promise.all(
      posts.map(async (post) => {
        const mountainInfo = await mountainModel.findOneByName(
          post.mountainName
        );
        return {
          userNickName: post.userNickName,
          postImg: post.postImg,
          postBody: post.postBody,
          postDate: post.postDate,
          mountainInfo: mountainInfo || null,
        };
      })
    );
    return result;
  }
}

const postService = new PostService(postModel);
module.exports = postService;
