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

  async searchByName(mountainName) {
    const searchConditions = [
      {
        $search: {
          index: 'mountainName_index',
          text: { query: mountainName, path: 'mountainName' },
        },
      },
    ];
    return await Mountain.aggregate(searchConditions);
  }

  async createMountain(mountainInfo) {
    return await Mountain.create(mountainInfo);
  }
}

const mountainModel = new MountainModel();
module.exports = mountainModel;
