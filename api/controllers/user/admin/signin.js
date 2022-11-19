/**
 * Module dependencies
 */

// ...

/**
 * user/admin/signin.js
 *
 * Signin admin.
 */
module.exports = async function signin(req, res) {
  const { username, password } = req.body;

  const userDoc = await User.getByUsername(username);

  if (!userDoc) return res.notFound("User not found");

  if (
    !userDoc.data().isAdmin ||
    !(await User.isCorrectPassword(password, userDoc.data().password))
  ) {
    return res.forbidden();
  }

  const token = User.generateJWT(userDoc);
  return res.send({ token });
};
