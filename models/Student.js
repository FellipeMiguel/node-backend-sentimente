const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  emotions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Emotions" }],
});

module.exports = mongoose.model("Student", StudentSchema);
