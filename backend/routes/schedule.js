import express from "express";
import ScheduleController from "../controllers/ScheduleController.js";

const router = express.Router();

router.post("/schedules", ScheduleController.createSchedule); // ➕ Добавить расписание
router.get("/schedules", ScheduleController.getSchedules); // 📋 Получить все записи расписания
router.get("/schedules/:id", ScheduleController.getScheduleById); // 🔎 Получить расписание по ID
router.put("/schedules/:id", ScheduleController.updateSchedule); // ✏️ Обновить расписание
router.delete("/schedules/:id", ScheduleController.deleteSchedule); // ❌ Удалить расписание

export default router;
