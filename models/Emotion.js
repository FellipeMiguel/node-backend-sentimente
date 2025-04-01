const mongoose = require("mongoose");

const EmotionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  date: { type: Date, required: true },
  emotion: {
    type: String,
    enum: [
      "Feliz",
      "Triste",
      "Irritado",
      "Calmo",
      "Cansado",
      "Grato",
      "Ansioso",
      "Amado",
      "Confuso",
      "Pensativo",
      "Empolgado",
      "Frustrado",
      "Sensível",
      "Confiante",
      "Estressado",
      "Realizado",
    ],
    required: true,
  },
});

module.exports = mongoose.model("Emotion", EmotionSchema);
