import express from "express";
import GroupController from "../controllers/GroupController.js";

const router = express.Router();

router.post("/groups", GroupController.PostGroup);      
router.get("/groups", GroupController.getGroups);      
router.get("/groups/:id", GroupController.getGroupById);
router.put("/groups/:id", GroupController.updateGroup); 
router.delete("/groups/:id", GroupController.deleteGroup); 
router.post("/groups/:id/addStudent", GroupController.addStudentToGroup);

export default router;
