/**
 * Module dependencies
 */

const User = require("../../models/User");

// ...

/**
 * user/signin.js
 *
 * Signin user.
 */
module.exports = async function signin(req, res) {
  const { username, password } = req.body;

  const userDoc = await User.getByUsername(username);

  if (!userDoc) return res.notFound("User not found");

  if (!(await User.isCorrectPassword(password, userDoc.data().password)))
    return res.forbidden("Wrong password");

  const token = User.generateJWT(userDoc);
  return res.send({ token });
};
