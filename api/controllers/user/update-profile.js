/**
 * Module dependencies
 */

const User = require("../../models/User");

// ...

/**
 * user/update-profile.js
 *
 * Update profile.
 */
module.exports = async function updateProfile(req, res) {
  const { username: newUsername, email: newEmail } = req.body;

  const { username: oldUsername, email: oldEmail } = (
    await User.getById(req.user.id)
  ).data();

  if (
    newUsername &&
    newUsername !== oldUsername &&
    !(await User.isUniqueField("username", newUsername))
  ) {
    return res.fieldIsInUser("Username is Already In Use");
  }

  if (
    newEmail &&
    newEmail !== oldEmail &&
    !(await User.isUniqueField("email", newEmail))
  ) {
    return res.fieldIsInUser("Email is Already In Use");
  }

  const id = req.user.id;

  User.update({ id, ...req.body });

  return res.ok("Profile updated successfully");
};
