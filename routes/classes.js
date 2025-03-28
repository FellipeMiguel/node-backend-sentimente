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

router.get("/", async (req, res) => {
  try {
    const teacherId = req.userId;
    const classes = await ClassModel.find({ teacher: teacherId }).populate(
      "students"
    );
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Error fetching classes." });
  }
});

router.get("/:classId", async (req, res) => {
  try {
    const { classId } = req.params;
    const classData = await ClassModel.findById(classId).populate("students");
    if (!classData) {
      return res.status(404).json({ error: "Class not found." });
    }
    res.status(200).json(classData);
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ error: "Error fetching class." });
  }
});

module.exports = router;
