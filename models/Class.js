/**
 * Mongoose schema for the Class model.
 * Represents a class with a name, a teacher, and a list of students.
 *
 * @typedef {Object} Class
 * @property {string} name - The name of the class. This field is required.
 * @property {mongoose.Schema.Types.ObjectId} teacher - The ID of the teacher associated with the class. This field is required and references the User model.
 * @property {mongoose.Schema.Types.ObjectId[]} students - An array of student IDs associated with the class. Each ID references the Student model.
 */

const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

module.exports = mongoose.model("Class", ClassSchema);
