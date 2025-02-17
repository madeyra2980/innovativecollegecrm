import express from "express";
import SubjectController from "../controllers/SubjectController.js";

const router = express.Router();

router.post("/subjects", SubjectController.createSubject); // ➕ Добавить предмет
router.get("/subjects", SubjectController.getSubjects); // 📋 Получить все предметы
router.get("/subjects/:id", SubjectController.getSubjectById); // 🔎 Получить предмет по ID
router.put("/subjects/:id", SubjectController.updateSubject); // ✏️ Обновить предмет
router.delete("/subjects/:id", SubjectController.deleteSubject); // ❌ Удалить предмет

export default router;
