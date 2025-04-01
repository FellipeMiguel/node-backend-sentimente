// models/DateRecord.js
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
