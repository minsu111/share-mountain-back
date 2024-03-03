const { model } = require('mongoose');
const MountainSchema = require('../schemas/mountainSchema.js');

const Mountain = model('mountain', MountainSchema);

class MountainModel {
  async findAllMountains() {
    return await Mountain.find({});
  }

  async findOneByName(mountainName) {
    return await Mountain.findOne({ mountainName: mountainName });
  }
}

const mountainModel = new MountainModel();
module.exports = mountainModel;
