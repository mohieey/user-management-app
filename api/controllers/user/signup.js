/**
 * Module dependencies
 */

const User = require("../../models/User");

// ...

/**
 * user/signup.js
 *
 * Signup user.
 */
module.exports = async function signup(req, res) {
  const { username, email } = req.body;

  const validationResult = User.validateUser(req.body);
  if (validationResult.error) {
    res.badRequest(validationResult.error.details[0].message);
  }

  if (!(await User.isUniqueField("username", username)))
    return res.fieldIsInUser("Username is Already In Use");

  if (!(await User.isUniqueField("email", email)))
    return res.fieldIsInUser("Email is Already In Use");

  const userDoc = await (await User.create({ ...req.body })).get();

  const token = User.generateJWT(userDoc);
  return res.send({ token });
};
