const { jwtSecret } = require("../../config/secrets.js");
const jwt = require("jsonwebtoken");

module.exports = {
  generateToken,
};

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };
  const options = {
    expiresIn: 2000,
  };

  return jwt.sign(payload, jwtSecret, options);
}
