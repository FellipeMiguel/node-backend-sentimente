/**
 * @fileoverview Routes for handling emotions-related operations.
 * @module routes/emotions
 */

/**
 * POST /:classId/student/:studentId
 * Records a new emotion for a specific student in a class.
 *
 * @name POST/:classId/student/:studentId
 * @function
 * @memberof module:routes/emotions
 * @param {string} req.params.classId - The ID of the class.
 * @param {string} req.params.studentId - The ID of the student.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.emotion - The emotion to record.
 * @param {string} req.body.date - The date of the emotion.
 * @returns {Object} 201 - Emotion recorded successfully.
 * @returns {Object} 500 - Error recording emotion.
 */

/**
 * GET /
 * Fetches the count of emotions for a specific class on a specific date.
 *
 * @name GET/
 * @function
 * @memberof module:routes/emotions
 * @param {Object} req.query - The query parameters.
 * @param {string} req.query.date - The date to filter emotions.
 * @param {string} req.query.classId - The ID of the class to filter emotions.
 * @returns {Object} 200 - An object containing the count of votes for each emotion.
 * @returns {Object} 400 - Error if date or classId is missing.
 * @returns {Object} 500 - Error fetching emotions.
 */

const express = require("express");
const Emotion = require("../models/Emotion");
const Student = require("../models/Student");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/:classId/student/:studentId", async (req, res, next) => {
  try {
    const { emotion, date } = req.body;
    const { classId, studentId } = req.params;

    const newEmotion = new Emotion({
      student: studentId,
      class: classId,
      date,
      emotion,
    });
    await newEmotion.save();

    await Student.findByIdAndUpdate(studentId, {
      $push: { emotions: newEmotion._id },
    });

    res
      .status(201)
      .json({ message: "Emotion recorded sucessfully", newEmotion });
  } catch (error) {
    console.error("Error recording emotion:", error);
    res.status(500).json({ error: "Error recording emotion." });
  }
});

router.get("/", async (req, res) => {
  try {
    const { date, classId } = req.query;
    if (!date || !classId) {
      return res.status(400).json({ error: "Date and classId are required." });
    }

    // Buscar todas as emoções para a data e turma fornecidas
    const emotions = await Emotion.find({ date, class: classId });

    // Contabilizar os votos para cada emoção
    const votes = {};
    emotions.forEach((e) => {
      votes[e.emotion] = (votes[e.emotion] || 0) + 1;
    });

    res.status(200).json({ votes });
  } catch (error) {
    console.error("Error fetching emotions:", error);
    res.status(500).json({ error: "Error fetching emotions." });
  }
});

router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { classId } = req.query;

    if (!classId) {
      return res
        .status(400)
        .json({ error: "Query parameter classId is required." });
    }

    // Busca todos os registros daquele aluno na turma, ordenando por data
    const records = await Emotion.find({
      student: studentId,
      class: classId,
    }).sort({ date: 1 });

    // Responde com array de objetos { date, emotion }
    const history = records.map((r) => ({
      date: r.date.toISOString(),
      emotion: r.emotion,
    }));

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching student history:", error);
    res.status(500).json({ error: "Error fetching student history." });
  }
});

module.exports = router;
