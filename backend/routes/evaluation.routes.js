import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
    addNewEvaluation,
    getAllCourseAndTaList,
    getSummary
} from "../controllers/evaluation.controller.js";
const router = Router();



// router.post('/create', isLoggedIn, authorizeRoles('DS'), createApplication);
router.post('/addNewEvaluation', isLoggedIn, authorizeRoles('INS'), addNewEvaluation);
router.post('/getAllCourseAndTaList', isLoggedIn, authorizeRoles('INS'), getAllCourseAndTaList);
router.post('/getSummary', isLoggedIn, authorizeRoles('INS'), getSummary);


export default router;
