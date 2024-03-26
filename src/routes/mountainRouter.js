const { Router } = require('express');
const mountainService = require('../services/mountainService.js');
const asyncHandler = require('../middlewares/asyncHandler.js');
const upload = require('../middlewares/imageUploadHandler.js');

const mountainRouter = Router();

mountainRouter.get(
  '/mountains',
  asyncHandler(async (req, res, next) => {
    const result = await mountainService.getAllMountains();
    res.json(result);
  })
);

mountainRouter.get(
  '/:mountainName',
  asyncHandler(async (req, res, next) => {
    const result = await mountainService.getMountainByName(
      req.params.mountainName
    );

    res.json(result);
  })
);

mountainRouter.get('/search/:searchKeyWord', async (req, res, next) => {
  try {
    const result = await mountainService.searchMountain(
      req.params.searchKeyWord
    );
    res.json(result);
    console.log(req.params.searchKeyWord);
  } catch (err) {
    next(err);
  }
});

mountainRouter.post(
  '/add/mountainInfo',
  upload.single('img1'),
  asyncHandler(async (req, res, next) => {
    if (
      req.body.mountain_name == '' ||
      req.body.mountain_level == '' ||
      req.body.mountain_address == ''
    ) {
      res.send('정보를 모두 입력해주세요.');
    }
    await mountainService.addMountainInfo(req, res);
  })
);

module.exports = mountainRouter;
