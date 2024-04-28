import { Router } from "express";
import {
  changePassword,
  createUser,
  deleteUser,
  forgotPassword,
  getAllUser,
  getLoggedInUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  verifyAccount,
  getInstructorList
} from "../controllers/user.controller.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
// import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register", registerUser);
// router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", isLoggedIn, getLoggedInUserDetails);
router.post("/reset", forgotPassword);
router.post("/reset/:resetToken", resetPassword);
router.post("/change-password", isLoggedIn, changePassword);
router.put("/update", isLoggedIn, updateUser);
router.post("/verify/:verificationToken", verifyAccount);


// router.post("/create", isLoggedIn, authorizeRoles('ADMIN'), createUser);
router.post("/create", isLoggedIn,  createUser);
// router.post("/delete", isLoggedIn, authorizeRoles('ADMIN'), deleteUser);
router.post("/delete", isLoggedIn, deleteUser);
// router.post("/getAllUser", isLoggedIn, authorizeRoles('ADMIN'), getAllUser)
router.post("/getAllUser", isLoggedIn, getAllUser);

router.post('/getInstructorList', isLoggedIn, getInstructorList);
export default router;
