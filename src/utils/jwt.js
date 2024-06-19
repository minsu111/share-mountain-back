const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (payload) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

  return token;
};

const refreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    const payload = {
      userId: decoded.userId,
    };

    // 새 토큰 생성
    const newToken = generateToken(payload);
    return newToken;
  } catch (error) {
    console.error('error refreshing token', error);
  }
};

module.exports = { generateToken, refreshToken };
