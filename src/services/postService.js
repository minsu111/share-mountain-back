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

  async getMountainPosts(mountainName) {
    return await postModel.findMountainPosts(mountainName);
  }
  async addMountainPost(req, selectedMountain) {
    const fileLocations = req.files.map((file) => file.location);

    const currentDate = new Date();
    const formattedHours =
      currentDate.getHours() < 10
        ? '0' + currentDate.getHours()
        : currentDate.getHours();
    const formattedMinutes =
      currentDate.getMinutes() < 10
        ? '0' + currentDate.getMinutes()
        : currentDate.getMinutes();

    const formattedDate = `${
      currentDate.getMonth() + 1
    }월 ${currentDate.getDate()}일 ${formattedHours}:${formattedMinutes}`;

    if (req) {
      return await postModel.createPost({
        userNickName: '엄홍민수(test)',
        postImg: fileLocations,
        postBody: req.body.post_text,
        postDate: formattedDate,
        mountainName: selectedMountain,
      });
    }
  }
}

const postService = new PostService(postModel);
module.exports = postService;
