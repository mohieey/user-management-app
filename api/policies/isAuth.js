const User = require("../models/User");

module.exports = async function (req, res, proceed) {
  try {
    const payload = User.isValidJWT(req.headers.auth_token);
    req.user = payload;
    return proceed();
  } catch (error) {
    return res.forbidden("Please login first");
  }
};
