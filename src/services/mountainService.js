const mountainModel = require('../db/models/mountainModel.js');

class MountainService {
  async getAllMountains() {
    return await mountainModel.findAllMountains();
  }
}

const mountainService = new MountainService(mountainModel);
module.exports = mountainService;
