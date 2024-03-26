const { Schema } = require('mongoose');

const UserSchema = new Schema(
  {
    emailId: {
      type: String,
      // required: true,
    },
    userName: {
      type: String,
      // required: true,
    },
    nickName: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
    },
  },
  {
    collection: 'users',
    timestamps: true,
    versionKey: false,
  }
);

module.exports = UserSchema;
