/**
 * @fileoverview Routes for managing dates associated with a teacher and class.
 * Provides endpoints to fetch, add, and delete date records.
 */

/**
 * GET /dates/
 * Fetches all date records for the authenticated teacher and a specific class.
 *
 * @name GetDates
 * @route {GET} /
 * @queryparam {string} classId - The ID of the class to fetch dates for.
 * @returns {Object[]} 200 - An array of date records.
 * @returns {Object} 400 - Error message if classId is missing.
 * @returns {Object} 500 - Error message if an internal server error occurs.
 */

/**
 * POST /dates/
 * Adds a new date record for the authenticated teacher and a specific class.
 *
 * @name AddDate
 * @route {POST} /
 * @bodyparam {string} date - The date to be added.
 * @bodyparam {string} classId - The ID of the class associated with the date.
 * @returns {Object} 201 - Success message and the newly created date record.
 * @returns {Object} 400 - Error message if date or classId is missing.
 * @returns {Object} 500 - Error message if an internal server error occurs.
 */

/**
 * DELETE /dates/:id
 * Deletes a specific date record by its ID.
 *
 * @name DeleteDate
 * @route {DELETE} /:id
 * @routeparam {string} id - The ID of the date record to delete.
 * @returns {Object} 200 - Success message if the date record is deleted.
 * @returns {Object} 404 - Error message if the date record is not found.
 * @returns {Object} 500 - Error message if an internal server error occurs.
 */

const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const DateRecord = require("../models/DateRecord");

const router = express.Router();
router.use(authMiddleware);

// Rota para buscar todas as datas do professor
router.get("/", async (req, res) => {
  try {
    const { classId } = req.query;
    if (!classId)
      return res.status(400).json({ error: "classId é obrigatório na query." });

    const dates = await DateRecord.find({ teacher: req.userId, classId });
    res.status(200).json(dates);
  } catch (error) {
    console.error("Erro ao buscar datas:", error);
    res.status(500).json({ error: "Erro ao buscar datas." });
  }
});

// Rota para adicionar uma nova data
router.post("/", async (req, res) => {
  try {
    const { date, classId } = req.body;
    if (!date || !classId)
      return res
        .status(400)
        .json({ error: "Data e classId são obrigatórios." });

    const newDate = new DateRecord({ teacher: req.userId, classId, date });
    await newDate.save();

    res.status(201).json({ message: "Data salva com sucesso!", newDate });
  } catch (error) {
    console.error("Erro ao salvar data:", error);
    res.status(500).json({ error: "Erro ao salvar data." });
  }
});

// Rota para deletar uma data
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DateRecord.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ error: "Data não encontrada." });
    res.status(200).json({ message: "Data excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir data:", error);
    res.status(500).json({ error: "Erro ao excluir data." });
  }
});

module.exports = router;
