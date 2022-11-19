const User = require("../models/User");

module.exports = async function (req, res, proceed) {
  try {
    const payload = User.isValidJWT(req.headers.auth_token);
    if (!payload.isAdmin) return res.forbidden();

    req.user = payload;
    return proceed();
  } catch (error) {
    return res.forbidden();
  }
};
