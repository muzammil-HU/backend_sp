import express from "express";
import {
  getEmployees,
  getStudentById,
  login,
} from "../Controllers/authControllers.js";

const router = express.Router();

router.post("/login", login);
router.get("/emp", getEmployees);
router.get("/stu", getStudentById);

export default router;
