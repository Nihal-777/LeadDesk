import { body } from 'express-validator';

export const createLeadValidator = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('budget')
    .notEmpty()
    .withMessage('Budget is required'),
  body('message')
    .trim()
    .isLength({ min: 20 })
    .withMessage('Message must be at least 20 characters long'),
];

export const updateStatusValidator = [
  body('status')
    .isIn(['New', 'Contacted', 'Closed'])
    .withMessage('Status must be one of: New, Contacted, Closed'),
];
