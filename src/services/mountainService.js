const mountainModel = require('../db/models/mountainModel.js');

class MountainService {
  async getAllMountains() {
    return await mountainModel.findAllMountains();
  }

  async getMountainById(mountainId) {
    return await mountainModel.findOneById(mountainId);
  }
}

const mountainService = new MountainService(mountainModel);
module.exports = mountainService;
