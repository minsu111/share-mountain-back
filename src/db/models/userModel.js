const { model } = require('mongoose');
const UserSchema = require('../schemas/userSchema.js');

const User = model('users', UserSchema);

class UserModel {
  async findByEmail(email) {
    return await User.findOne({ emailId: email });
  }

  async createUser(userInfo) {
    return await User.create(userInfo);
  }

  async findByNickName(nickname) {
    return await User.findOne({ nickName: nickname });
  }
}

const userModel = new UserModel();
module.exports = userModel;
