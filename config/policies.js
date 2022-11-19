/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,
  "user/signin": ["validateSignIn"],
  "user/admin/signin": ["validateSignIn"],
  "user/get-profile": ["isAuth"],
  "user/update-profile": ["isAuth"],
  "user/search": ["isAuth", "isAdmin"],
};
