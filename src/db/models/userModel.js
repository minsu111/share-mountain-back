const { model } = require('mongoose');
const UserSchema = require('../schemas/index.js');

const User = model('users', UserSchema);

class UserModel {
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }
}

export default new UserModel();
