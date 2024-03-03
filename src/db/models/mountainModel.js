const { model } = require('mongoose');
const MountainSchema = require('../schemas/mountainSchema.js');

const Mountain = model('mountain', MountainSchema);

class MountainModel {
  async findAllMountains() {
    return await Mountain.find({});
  }
}

const mountainModel = new MountainModel();
module.exports = mountainModel;
