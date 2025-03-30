import Book from "../models/Book.js";
import authenticateToken from "../middleware/authMiddleware.js";

const createBook = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const {
      title,
      author,
      description,
      category,
      price,
      publishedDate,
      image,
      stock,
    } = req.body;

    const newBook = new Book({
      title,
      author,
      description,
      category,
      price,
      publishedDate,
      image,
      stock,
      addedBy: req.user._id,
    });

    await newBook.save();

    res.status(201).json({ message: "Book added successfully", newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBook = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book updated successfully", updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBook = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .populate("addedBy", "username email");

    res.status(200).json({ status: "Success", data: books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getrecentbooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ status: "Success", data: books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const searchBooks = async (req, res) => {
  try {
    const { title, author, category } = req.query;
    const query = {};

    if (title) query.title = { $regex: title, $options: "i" };
    if (author) query.author = { $regex: author, $options: "i" };
    if (category) query.category = { $regex: category, $options: "i" };
    const books = await Book.find(query);

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getrecentbooks,
  searchBooks,
};
