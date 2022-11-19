/**
 * Module dependencies
 */

const User = require("../../models/User");

// ...

/**
 * user/search.js
 *
 * Search user.
 */
module.exports = async function search(req, res) {
  const { username, email, page, limit } = req.allParams();

  const results = await User.searchIndex(username, email, page, limit);
  return res.ok(results);
};
