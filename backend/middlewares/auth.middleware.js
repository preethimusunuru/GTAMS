import jwt from "jsonwebtoken";

import AppError from "../utils/appError.js";
import asyncHandler from "./asyncHandler.middleware.js";

export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  // extracting token from the cookies
  // console.log(req);
  try {
    const { token } = req.cookies;
    // console.log(token);
    // If no token send unauthorized message
    if (!token) {
      return next(new AppError("Unauthorized, please login to continue", 401));
    }

    // Decoding the token using jwt package verify method
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // If no decode send the message unauthorized
    if (!decoded) {
      return next(new AppError("Unauthorized, please login to continue", 401));
    }

    // If all good store the id in req object, here we are modifying the request object and adding a custom field user in it
    req.user = decoded;

    // Do not forget to call the next other wise the flow of execution will not be passed further
    next();

  } catch (err) {
    console.log('error in isLoggedIn: ', err);
  }

});

// Middleware to check if user is admin or not
export const authorizeRoles = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    // console.log('role is :', roles)
    // console.log('req role is :', req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to view this route", 403)
      );
    }

    next();
  });
