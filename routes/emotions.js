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

module.exports = router;
