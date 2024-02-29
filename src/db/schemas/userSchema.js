import { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    emailId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

export default UserSchema;
