const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const DateRecord = require("../models/DateRecord");

const router = express.Router();
router.use(authMiddleware);

// Rota para buscar todas as datas do professor
router.get("/", async (req, res) => {
  try {
    const dates = await DateRecord.find({ teacher: req.userId });
    res.status(200).json(dates);
  } catch (error) {
    console.error("Erro ao buscar datas:", error);
    res.status(500).json({ error: "Erro ao buscar datas." });
  }
});

// Rota para adicionar uma nova data
router.post("/", async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ error: "A data é obrigatória." });

    const newDate = new DateRecord({ teacher: req.userId, date });
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
