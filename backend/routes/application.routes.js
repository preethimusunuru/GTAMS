import { Router } from "express";
import {
    createApplication,
    updateApplication,
    deleteApplication,
    applyToApplication,
    getAllJobs,
    getApplicationByJobId,
    getAllJobsByUserId
} from "../controllers/application.controller.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post('/create', isLoggedIn, authorizeRoles('DS'), createApplication);
router.put('/update/:id', isLoggedIn, authorizeRoles('DS'), updateApplication);
router.delete('/delete/:id', isLoggedIn, authorizeRoles('DS'), deleteApplication);
router.post('/apply/:id', isLoggedIn, upload.single('file'), applyToApplication);
router.post('/getAllJobs', getAllJobs);
router.post('/getApplicationById/:jobId', getApplicationByJobId);
router.post('/getAllJobsByUserId', isLoggedIn, getAllJobsByUserId);

export default router;
