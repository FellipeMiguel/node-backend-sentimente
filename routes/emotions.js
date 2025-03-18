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
  } catch {
    console.error("Error recording emotion:", error);
    res.status(500).json({ error: "Error recording emotion." });
  }
});

module.exports = router;
