/**
 * Schema representing a record of a date associated with a teacher and a class.
 *
 * @typedef {Object} DateRecordSchema
 * @property {mongoose.Schema.Types.ObjectId} teacher - Reference to the User model, representing the teacher. This field is required.
 * @property {mongoose.Schema.Types.ObjectId} classId - Reference to the Class model, representing the class. This field is required.
 * @property {string} date - The date associated with the record, stored as a string. This field is required.
 */

const mongoose = require("mongoose");

const DateRecordSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  date: { type: String, required: true },
});

module.exports = mongoose.model("DateRecord", DateRecordSchema);
