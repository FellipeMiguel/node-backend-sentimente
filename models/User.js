// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "teacher" },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }], // Relacionamento com turmas
});

module.exports = mongoose.model("User", UserSchema);
