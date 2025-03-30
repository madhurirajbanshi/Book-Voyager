import express from 'express';
import { addTofavourites, removeFromfavourites, getFavourites } from '../controllers/favouritesController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticateToken, addTofavourites);
router.delete('/remove/:bookId', authenticateToken, removeFromfavourites);
router.get('/', authenticateToken, getFavourites);

export default router;