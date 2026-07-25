import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { AuthRequest } from '../middleware/auth';

// Dynamic getter function to resolve the JWT secret.
// Evaluating it inside functions instead of at module load time prevents
// environment variable race conditions with dotenv config loaders.
const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'super_secret_jwt_key_123456!@#';
};

/**
 * Controller: Admin Registration
 * Creates a new administrator login profile in MongoDB.
 * Passwords are encrypted with a random salt factor of 10 using bcryptjs.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check if an administrator account already exists under the requested email
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'An administrator with that email already exists.',
      });
    }

    // Generate salt and hash the plaintext password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Save the new admin credentials
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Admin Login
 * Checks admin credentials, validates the hashed password,
 * and issues a signed JSON Web Token (JWT) expiring in 7 days.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Query for the administrator by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Perform a secure comparison between the entered password and the database hash
    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Sign a new JWT containing the admin identity payload
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get Admin Identity
 * Verifies active session token by pulling the authenticated admin's details
 * from the database (excluding password hash) using the ID stored in the request.
 */
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    // Retrieve the admin details without returning the hashed password field
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
