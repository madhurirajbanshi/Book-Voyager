import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getrecentbooks,
  searchBooks,
} from "../controllers/bookController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authenticateToken, createBook);
router.get("/", getAllBooks);
router.get("/recentbooks", getrecentbooks);
router.get("/search", searchBooks);
router.get("/:id", getBookById);
router.put("/:id", authenticateToken, updateBook);
router.delete("/:id", authenticateToken, deleteBook);

export default router;
