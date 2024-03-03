const { Router } = require('express');
const mountainService = require('../services/mountainService.js');

const mountainRouter = Router();

mountainRouter.get('/mountains', async (req, res, next) => {
  try {
    const result = await mountainService.getAllMountains();
    if (!result) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

mountainRouter.get('/:mountainId', async (req, res, next) => {
  try {
    const result = await mountainService.getMountainById(req.params.mountainId);
    if (!result) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = mountainRouter;
