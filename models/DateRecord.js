// models/DateEntry.js
const mongoose = require("mongoose");

const DateEntrySchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DateEntry", DateEntrySchema);
