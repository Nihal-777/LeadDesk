import { Router } from 'express';
import {
  createLead,
  getLeads,
  searchLeads,
  updateLeadStatus,
  deleteLead,
} from '../controllers/leadController';
import { createLeadValidator, updateStatusValidator } from '../validators/leadValidator';
import { validateRequest } from '../middleware/validate';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public route to submit leads
router.post('/', createLeadValidator, validateRequest, createLead);

// Protected admin routes
router.get('/', authenticateToken as any, getLeads);
router.get('/search', authenticateToken as any, searchLeads);
router.patch('/:id', authenticateToken as any, updateStatusValidator, validateRequest, updateLeadStatus);
router.delete('/:id', authenticateToken as any, deleteLead);

export default router;
