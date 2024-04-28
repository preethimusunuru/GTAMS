import crypto from 'crypto';
import fs from 'fs/promises';

import cloudinary from 'cloudinary';

import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/appError.js';
import User from '../models/user.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import Application from '../models/application.model.js';

const cookieOptions = {
  secure: true,
  maxAge: 5 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'None',
};


export const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, phone } = req.body;
  console.log(req.body);
  if (!fullName || !email || !password || !phone) {
    return next(new AppError('All fields are required', 408));
  }
  let userExists = await User.findOne({ email });

  if (userExists) {

    if (userExists.signupverified) {
      return next(new AppError('Email already exists', 409));
    } else {
      userExists.fullName = fullName;
      userExists.email = email;
      userExists.password = password;
      userExists.signupTokenExpiry = undefined;
      userExists.signupToken = undefined;
      await userExists.save();
    }
  } else {
    userExists = await User.create({
      fullName,
      email,
      password,
      phone,
    });
    if (!userExists) {
      return next(
        new AppError('User registration failed, please try again later', 400)
      );
    }

  }


  const signupToken = await userExists.generateSignupToken();
  //console.log("signupToken", signupToken);
  await userExists.save();

  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${signupToken}`;

  const subject = 'Account Verification';
  const message = `<p style="font-size:1.2rem;">You can now verify your account by clicking <a href=${verificationUrl} target="_blank">Verify your account</a><br>If the above link does not work for some reason then copy paste this link in new tab ${verificationUrl}.<br> If you have not requested this, kindly ignore.<br>Only valid for 15 minutes.</p>`;

  try {
    await sendEmail(email, subject, message);

    // If email sent successfully send the success response
    await userExists.save();

    return res.status(200).json({
      success: true,
      // message: `Verification Link has been sent to ${email} successfully`,
      message: `Now you can login`,
    });
  } catch (error) {
    // If some error happened we need to clear the forgotPassword* fields in our DB
    userExists.signupToken = undefined;
    userExists.signupTokenExpiry = undefined;

    await userExists.save();

    return next(
      new AppError(
        error.message || 'Something went wrong, please try again.',
        500
      )
    );
  }
});


export const loginUser = asyncHandler(async (req, res, next) => {
  // Destructuring the necessary data from req object
  const { email, password } = req.body;

  // Check if the data is there or not, if not throw error message
  if (!email || !password) {
    return next(new AppError('Email and Password are required', 400));
  }

  // Finding the user with the sent email
  const user = await User.findOne({ email }).select('+password');

  // If no user or sent password do not match then send generic response
  if (!(user && (await user.comparePassword(password)) && user.signupverified)) {
    return next(
      new AppError('Email or Password do not match or user does not exist', 401)
    );
  }

  // Generating a JWT token
  const token = await user.generateJWTToken();

  // Setting the password to undefined so it does not get sent in the response
  user.password = undefined;

  // Setting the token in the cookie with name token along with cookieOptions
  res.cookie('token', token, cookieOptions);

  // If all good send the response to the frontend
  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    user,
  });
});


export const logoutUser = asyncHandler(async (_req, res, _next) => {
  // Setting the cookie value to null
  res.cookie('token', null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  // Sending the response
  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});


export const getLoggedInUserDetails = asyncHandler(async (req, res, _next) => {
  // Finding the user using the id from modified req object
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    message: 'User details',
    user,
  });
});


export const forgotPassword = asyncHandler(async (req, res, next) => {
  // Extracting email from request body
  const { email } = req.body;

  const user = await User.findOne({ email });

  // If no email found send the message email not found
  if (!user) {
    return next(new AppError('This E-mail not registered', 400));
  }

  // Generating the reset token via the method we have in user model
  const resetToken = await user.generatePasswordResetToken();

  // Saving the forgotPassword* to DB
  await user.save();

  // constructing a url to send the correct data
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // We here need to send an email to the user with the token
  const subject = 'GTAMS : Reset Password for ' + user.email;
  const message = `<p>
    You can reset your password by clicking 
    <a href="${resetPasswordUrl}" target="_blank">Reset your password</a>
    <br>
    If the above link does not work for some reason, then copy-paste this link in a new tab:
    <br>
    <a href="${resetPasswordUrl}" target="_blank">${resetPasswordUrl}</a>
    <br>
    If you have not requested this, kindly ignore.
  </p>`;


  try {
    await sendEmail(email, subject, message);

    // If email sent successfully send the success response
    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`,
    });
  } catch (error) {
    // If some error happened we need to clear the forgotPassword* fields in our DB
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    return next(
      new AppError(
        error.message || 'Something went wrong, please try again.',
        500
      )
    );
  }
});


export const resetPassword = asyncHandler(async (req, res, next) => {
  // Extracting resetToken from req.params object
  const { resetToken } = req.params;

  // Extracting password from req.body object
  const { password } = req.body;

  // We are again hashing the resetToken using sha256 since we have stored our resetToken in DB using the same algorithm
  const forgotPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Check if password is not there then send response saying password is required
  if (!password) {
    return next(new AppError('Password is required', 400));
  }

  console.log(forgotPasswordToken);

  // Checking if token matches in DB and if it is still valid(Not expired)
  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() }, // $gt will help us check for greater than value, with this we can check if token is valid or expired
  });

  // If not found or expired send the response
  if (!user) {
    return next(
      new AppError('Token is invalid or expired, please try again', 400)
    );
  }

  // Update the password if token is valid and not expired
  user.password = password;

  // making forgotPassword* valus undefined in the DB
  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  // Saving the updated user values
  await user.save();

  // Sending the response when everything goes good
  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});


export const changePassword = asyncHandler(async (req, res, next) => {
  // Destructuring the necessary data from the req object
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user; // because of the middleware isLoggedIn

  // Check if the values are there or not
  if (!oldPassword || !newPassword) {
    return next(
      new AppError('Old password and new password are required', 400)
    );
  }

  // Finding the user by ID and selecting the password
  const user = await User.findById(id).select('+password');

  // If no user then throw an error message
  if (!user) {
    return next(new AppError('Invalid user id or user does not exist', 400));
  }

  // Check if the old password is correct
  const isPasswordValid = await user.comparePassword(oldPassword);

  // If the old password is not valid then throw an error message
  if (!isPasswordValid) {
    return next(new AppError('Invalid old password', 400));
  }

  // Setting the new password
  user.password = newPassword;

  // Save the data in DB
  await user.save();

  // Setting the password undefined so that it won't get sent in the response
  user.password = undefined;

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});


export const updateUser = asyncHandler(async (req, res, next) => {
  try {
    // Destructuring the necessary data from the req object
    const { fullName, contact, address, phone } = req.body;
    // const { id } = req.user.id;
    // console.log(req.user);

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('Invalid user id or user does not exist'));
    }

    user.fullName = fullName;
    user.contact = contact;
    user.address = address;
    user.phone = phone;

    // // Run only if user sends a file
    // if (req.file) {
    //   // Deletes the old image uploaded by the user
    //   await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    //   try {
    //     const result = await cloudinary.v2.uploader.upload(req.file.path, {
    //       folder: 'lms', // Save files in a folder named lms
    //       width: 250,
    //       height: 250,
    //       gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
    //       crop: 'fill',
    //     });

    //     // If success
    //     if (result) {
    //       // Set the public_id and secure_url in DB
    //       user.avatar.public_id = result.public_id;
    //       user.avatar.secure_url = result.secure_url;

    //       // After successful upload remove the file from local storage
    //       fs.rm(`uploads/${req.file.filename}`);
    //     }
    //   } catch (error) {
    //     return next(
    //       new AppError(error || 'File not uploaded, please try again', 400)
    //     );
    //   }
    // }

    // Save the user object
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User details updated successfully',
    });
  } catch (err) {
    console.log(err);
  }

});


export const verifyAccount = asyncHandler(async (req, res, next) => {
  const { verificationToken } = req.params;


  const signupToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');


  //console.log(signupToken);

  const user = await User.findOne({
    signupToken,
    signupTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError('Link is invalid or expired, please try again', 400)
    );
  }

  user.signupverified = true;

  user.signupToken = undefined;
  user.signupTokenExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User Verified successfully',
  });
});



export const createUser = asyncHandler(async (req, res, next) => {
  var formData = req.body;
  formData.signupverified = true;

  const user = await User.create(formData);

  if (!user) {
    return next(new AppError('User not created.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User created successfully',
    user
  });
});



export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  // console.log(req.body)
  const result = await User.findByIdAndDelete(id);
  // console.log('result is', result);
  if (!result) {
    return next(new AppError('User not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully.',
    result
  });
});


export const getAllUser = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully.',
    users
  });
});

// getInstructorList
export const getInstructorList = asyncHandler(async (req, res, next) => {
  const instructors = await User.find({ role: 'INS' }).select('_id fullName department');

  res.status(200).json({
    success: true,
    message: 'INS fetched successfully.',
    instructors
  });
});