const { Schema } = require('mongoose');

const PostSchema = new Schema(
  {
    userNicName: {
      type: String,
      required: true,
    },
    postImg: {
      type: Array,
      default: [],
    },
    postBody: {
      type: String,
      required: true,
    },
    postDate: {
      type: String,
      required: true,
    },
    mountainName: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'posts',
    timestamps: true,
  }
);

module.exports = PostSchema;
