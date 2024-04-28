import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
    getUserFormResponseByJobId,
    getAllFormResponseByJobId,
    changeFormStatusByFormId,
    rejectFromByFormId,
    acceptFromByFormId,
    offeredByDS,
    acceptByTa,

} from "../controllers/form.controller.js";
const router = Router();



// router.post('/create', isLoggedIn, authorizeRoles('DS'), createApplication);

router.post('/getUserFormResponseByJobId/:jobId', isLoggedIn, authorizeRoles('USER'), getUserFormResponseByJobId);
router.post('/getAllFormResponseByJobId/:jobId', isLoggedIn, authorizeRoles('DS', 'TACM'), getAllFormResponseByJobId);
router.post('/changeFormStatusByFormId', isLoggedIn, authorizeRoles('DS'), changeFormStatusByFormId);
router.post('/changeFormStatusToAcceptedByFormId', isLoggedIn, authorizeRoles('DS'), changeFormStatusByFormId);
router.post('/rejectFromByFormId', isLoggedIn, authorizeRoles('DS', 'TACM','USER'), rejectFromByFormId);
router.post('/accept', isLoggedIn, authorizeRoles('TACM'), acceptFromByFormId);
router.post('/accept-ds', isLoggedIn, authorizeRoles('DS'), offeredByDS);
router.post('/accept-ta', isLoggedIn, authorizeRoles('USER'), acceptByTa);


export default router;
