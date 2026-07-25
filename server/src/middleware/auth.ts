import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

/**
 * Custom Type Extension: AuthRequest
 * Extends the default Express Request to carry the decoded administrator session payload.
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Middleware: authenticateToken
 * Intercepts incoming requests on protected endpoints, extracts the JWT from the
 * Authorization header, and validates it.
 * 
 * - Returns 401 Unauthorized if the header is empty (not authenticated).
 * - Returns 403 Forbidden if the token is present but failed validation checks (invalid/expired).
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract token from standard header format: Authorization: Bearer <TOKEN>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: No token provided.',
    });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123456!@#';
    
    // Decrypt and assert schema format on the token payload
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    
    // Inject the decoded admin context into the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Invalid or expired token.',
    });
  }
};
