import crypto from 'crypto';

import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters'],
      lowercase: false,
      trim: true, // Removes unnecessary spaces
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please fill in a valid email address',
      ], // Matches email against regex
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Will not select password upon looking up a document
    },
    phone: {
      type: String,
      // required: [true,'Phone number is required'],
      minlength: [10, 'Phone number too small'],
      required: true,
      default: '1234567890'
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ['USER', 'DS', 'TACM', 'INS', , 'ADMIN'],
      default: 'USER',
    },
    department: {
      // type: Schema.Types.ObjectId,
      // ref: 'Department',
      type: String
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    signupToken: String,
    signupTokenExpiry: Date,
    signupverified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: ""
    },
    appliedFor: [{
      applicationId: {
        type: Schema.Types.ObjectId,
        ref: 'Application',
      },
      formId: {
        type: Schema.Types.ObjectId,
        ref: 'Form',
      }
    }],
    taUnder: [{
      instructor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      course: {
        type: Schema.Types.ObjectId,
        ref: 'course',
      }
    }],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Define an array of fields to exclude
        const fieldsToExclude = ['password'];

        // Use Object.assign and spread operator to omit specified fields
        return Object.assign({}, ...Object.keys(ret).map(key =>
          fieldsToExclude.includes(key) ? {} : { [key]: ret[key] }
        ));
      },
    },
  }
);

// Hashes password before saving to the database
userSchema.pre('save', async function (next) {
  // If password is not modified then do not hash it
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  // method which will help us compare plain password with hashed password and returns true or false
  comparePassword: async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  },

  // Will generate a JWT token with user id as payload
  generateJWTToken: async function () {
    return jwt.sign(
      { id: this._id, role: this.role, name: this.fullName },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },

  // This will generate a token for password reset
  generatePasswordResetToken: async function () {
    // creating a random token using node's built-in crypto module
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Again using crypto module to hash the generated resetToken with sha256 algorithm and storing it in database
    this.forgotPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Adding forgot password expiry to 15 minutes
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;

    return resetToken;
  },
  generateSignupToken: async function () {
    const signupToken = crypto.randomBytes(20).toString('hex');

    this.signupToken = crypto
      .createHash('sha256')
      .update(signupToken)
      .digest('hex');

    this.signupTokenExpiry = Date.now() + 15 * 60 * 1000;

    return signupToken;
  },
};

const User = model('User', userSchema);

export default User;