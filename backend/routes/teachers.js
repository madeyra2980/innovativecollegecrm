import express from "express";
import Teacher from "../controllers/teacherController.js";
const router = express.Router();



router.get("/teachers", Teacher.TeacherGet);
router.post("/teachers", Teacher.TeacherPost);
router.put("/teachers/:id", Teacher.TeacherUpdateById);
router.put("/teachers/name/:name", Teacher.TeacherUpdateByName);
router.delete("/teachers/:id", Teacher.TeacherDeleteById);
router.delete("/teachers/name/:name", Teacher.TeacherDeleteByName);

export default router;
