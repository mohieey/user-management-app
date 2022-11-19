const Joi = require("joi");
const User = require("../models/User");

module.exports = async function (req, res, proceed) {
  const validationResult = validateBody(req.body);
  if (validationResult.error)
    return res.badRequest(validationResult.error.details[0].message);

  return proceed();
};

const schema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().required(),
});

function validateBody(body) {
  const result = schema.validate(body);
  return result;
}
