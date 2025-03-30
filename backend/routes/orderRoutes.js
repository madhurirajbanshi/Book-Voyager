import express from "express";
import { placeOrder,getUserOrders,updateOrder} from "../controllers/orderController.js";
import authenticateToken from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post("/place", authenticateToken, placeOrder);
router.get("/getorders", authenticateToken, getUserOrders);
router.put("/update", authenticateToken, isAdmin, updateOrder);
export default router;
