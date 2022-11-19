/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require("bcrypt");
const db = require("../../db");
const jwt = require("jsonwebtoken");
const index = require("../../algoila")("users");
const Joi = require("joi");

module.exports = {
  attributes: {
    username: { type: "string", required: true },

    email: {
      required: true,
      type: "string",
      isEmail: true,
    },

    password: {
      required: true,
      type: "string",
      minLength: 6,
      regex: /^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i,
    },

    age: { required: true, type: "number", min: 18, max: 50 },

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },

  collection: db.collection("users"),

  async create({ username, email, age, password }) {
    password = await bcrypt.hash(password, 10);

    const userDoc = await this.collection.add({
      username,
      email,
      age,
      password,
      isAdmin: false,
    });

    this.saveToIndex(await userDoc.get());

    return userDoc;
  },

  async update({ id, username, email, age }) {
    const userDoc = await this.getById(id);
    const updateObject = {
      username: username || userDoc.data().username,
      email: email || userDoc.data().email,
      age: age || userDoc.data().age,
    };
    this.collection.doc(id).update(updateObject);

    this.saveToIndex(await this.getById(id));
  },

  async searchIndex(username, email, page, limit) {
    let query = "";
    username && (query = query.concat(" ", username));
    email && (query = query.concat(" ", email));

    const filters = {
      page: page ? page : 0,
      hitsPerPage: limit ? limit : 20,
    };
    const results = await index.search(query, filters);
    return results.hits;
  },

  saveToIndex(doc) {
    const record = doc.data();
    delete record.password;
    record.objectID = doc.id;
    index.saveObject(record).wait();
  },

  async getById(id) {
    const userDoc = await this.collection.doc(id).get();
    return userDoc;
  },

  async getByUsername(username) {
    const snapshot = await this.collection
      .where("username", "==", username)
      .get();
    const userDoc = snapshot.docs[0];
    return userDoc;
  },

  async isUniqueField(attribute, value) {
    const snapshot = await this.collection.where(attribute, "==", value).get();
    return snapshot.empty;
  },

  generateJWT(userDoc) {
    return jwt.sign(
      { id: userDoc.id, isAdmin: userDoc.data().isAdmin },
      process.env.JWT_SECRET
    );
  },

  async isCorrectPassword(plainTextPassword, encryptedPassword) {
    return await bcrypt.compare(plainTextPassword, encryptedPassword);
  },

  isValidJWT(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  },

  validateUser(user) {
    const result = schema.validate(user);
    return result;
  },
};

const schema = Joi.object({
  username: Joi.string().alphanum().required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .min(6)
    .pattern(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i)
    .required(),

  age: Joi.number().integer().min(18).max(50).required(),
});
