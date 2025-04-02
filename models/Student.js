/**
 * Mongoose schema for the Student model.
 *
 * @typedef {Object} Student
 * @property {string} name - The name of the student. This field is required.
 * @property {mongoose.Schema.Types.ObjectId} class - The ID of the class the student belongs to. This field is required and references the "Class" model.
 * @property {mongoose.Schema.Types.ObjectId[]} emotions - An array of IDs referencing the "Emotions" model, representing the emotions associated with the student.
 */

const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  emotions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Emotions" }],
});

module.exports = mongoose.model("Student", StudentSchema);
