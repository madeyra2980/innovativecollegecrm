import express from "express";
import StudentController from "../controllers/StudentController.js"; 

const router = express.Router();

router.get("/students", StudentController.getStudents);
router.get("/students/:id", StudentController.getStudentById);
router.post("/students", StudentController.postStudent);
router.post("/studentgroup", StudentController.postStudentGroup);
router.delete("/students/:id", StudentController.deleteStudent);

export default router;
