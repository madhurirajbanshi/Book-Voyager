import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import { addToCart,removeFromCart,getCart,updateCartItem} from '../controllers/cartController.js';


const router = express.Router();
router.post('/add', authenticateToken, addToCart);
router.delete('/remove/:bookId', authenticateToken, removeFromCart);
router.get('/getcart', authenticateToken, getCart);
router.patch('/update/:bookId',authenticateToken,updateCartItem);
export default router;