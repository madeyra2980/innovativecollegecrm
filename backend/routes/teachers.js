import express from "express";
import TeacherSubjectController from "../controllers/teacherSubjectController";

const router = express.Router();

router.get("/teachers", TeacherSubjectController.TeacherSubjectGet);

router.post("/teachers", TeacherSubjectController.TeacherSubjectPost);

router.put("/teachers/:id", TeacherSubjectController.TeacherSubjectUpdateById);

router.put("/teachers/name/:name", TeacherSubjectController.TeacherSubjectUpdateByName);

router.delete("/teachers/:id", TeacherSubjectController.TeacherSubjectDeleteById);

router.delete("/teachers/name/:name", TeacherSubjectController.TeacherSubjectDeleteByName);

export default router;
