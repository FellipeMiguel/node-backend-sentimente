const express = require("express");
const ClassModel = require("../models/Class");
const Student = require("../models/Student");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const { name, students } = req.body;
    const teacherId = req.userId;

    if (!name || !Array.isArray(students)) {
      return res
        .status(400)
        .json({ error: "Class name and students array are required." });
    }

    const newClass = new ClassModel({
      name,
      teacher: teacherId,
      students: [],
    });
    await newClass.save();

    const studentIds = [];
    for (const s of students) {
      if (s && typeof s === "object" && s.name) {
        const newStudent = new Student({
          name: s.name,
          class: newClass._id,
        });
        await newStudent.save();
        studentIds.push(newStudent._id);
      }
    }

    newClass.students = studentIds;
    await newClass.save();

    await User.findByIdAndUpdate(teacherId, {
      $push: { classes: newClass._id },
    });

    res.status(201).json({
      message: "Class created successfully!",
      newClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Error creating class." });
  }
});

module.exports = router;
