import express from "express";
import DateController from "../controllers/DateController.js";

const dateRouter = express.Router();

// Используем правильный синтаксис с двоеточием для параметра в URL
dateRouter.post("/dates", DateController.createDate);
dateRouter.get("/dates", DateController.getAllDates);
// Используем :id для указания параметра
dateRouter.get("/dates/:id", DateController.getDateById);
dateRouter.put("/dates/:id", DateController.updateDate);
dateRouter.delete("/dates/:id", DateController.deleteDate);  // Исправлено

export default dateRouter;
