const mountainModel = require('../db/models/mountainModel.js');

class MountainService {
  async getAllMountains() {
    return await mountainModel.findAllMountains();
  }

  async getMountainByName(mountainName) {
    return await mountainModel.findOneByName(mountainName);
  }

  async searchMountain(mountainName) {
    return await mountainModel.searchByName(mountainName);
  }

  async addMountainInfo(req) {
    return await mountainModel.createMountain({
      mountainName: req.body.mountain_name,
      mountainLevel: req.body.mountain_level,
      mountainAddress: req.body.mountain_address,
      mountainImgURL: req.file.location,
      createDate: new Date(),
    });
  }
}

const mountainService = new MountainService(mountainModel);
module.exports = mountainService;
