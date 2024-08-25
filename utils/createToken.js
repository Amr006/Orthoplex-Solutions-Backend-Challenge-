const jwt = require('jsonwebtoken');

const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "30h",
  });

module.exports = createToken;