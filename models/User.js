/**
 * User Schema for MongoDB using Mongoose.
 * Represents a user in the system with associated properties and relationships.
 *
 * @typedef {Object} User
 * @property {string} name - The name of the user. This field is required.
 * @property {string} email - The email of the user. This field is required and must be unique.
 * @property {string} password - The hashed password of the user. This field is required.
 * @property {string} [role="teacher"] - The role of the user in the system. Defaults to "teacher".
 * @property {Array<ObjectId>} classes - An array of ObjectIds referencing the "Class" model, representing the classes associated with the user.
 */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "teacher" },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }], // Relacionamento com turmas
});

module.exports = mongoose.model("User", UserSchema);
