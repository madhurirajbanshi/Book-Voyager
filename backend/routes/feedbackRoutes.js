import express from 'express';
import { addFeedback, getFeedbacks, deleteFeedback } from '../controllers/feedbackController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticateToken, addFeedback);

router.get('/', getFeedbacks);

router.delete('/:feedbackId',authenticateToken, deleteFeedback);

export default router;
