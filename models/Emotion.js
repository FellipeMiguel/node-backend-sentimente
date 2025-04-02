/**
 * EmotionSchema defines the structure for storing emotional data of students.
 *
 * @typedef {Object} EmotionSchema
 * @property {mongoose.Schema.Types.ObjectId} student - Reference to the Student document. Required.
 * @property {mongoose.Schema.Types.ObjectId} class - Reference to the Class document. Required.
 * @property {Date} date - The date when the emotion was recorded. Required.
 * @property {string} emotion - The type of emotion experienced. Must be one of the following:
 *   - "Feliz"
 *   - "Triste"
 *   - "Irritado"
 *   - "Calmo"
 *   - "Cansado"
 *   - "Grato"
 *   - "Ansioso"
 *   - "Amado"
 *   - "Confuso"
 *   - "Pensativo"
 *   - "Empolgado"
 *   - "Frustrado"
 *   - "Sensível"
 *   - "Confiante"
 *   - "Estressado"
 *   - "Realizado"
 *   Required.
 */

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
