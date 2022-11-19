/**
 * Module dependencies
 */

const User = require("../../models/User");

// ...

/**
 * user/get-profile.js
 *
 * Get profile.
 */
module.exports = async function getProfile(req, res) {
  const id = req.user.id;
  const user = (await User.getById(id)).data();

  if (!user) return res.notFound("User not found");
  delete user.password;

  return res.send({ user });
};
