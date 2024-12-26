import express from "express"
import { addTask, deleteTask, editTask, fetchTask, searchTask } from "../controller/todo.controller.js";

const router = express.Router();

router.get('/tasks', fetchTask);
router.post('/tasks', addTask);
router.put('/tasks/:id', editTask);
router.delete('/tasks/:id', deleteTask)
router.post('/search', searchTask);
export default router;