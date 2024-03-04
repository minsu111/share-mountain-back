const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      const result = await requestHandler(req, res);
      if (!result) {
        return res.status(404).json({ error: 'not found' });
      }
    } catch (err) {
      next(err);
    }
  };
};

module.exports = asyncHandler;
