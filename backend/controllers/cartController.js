import User from '../models/User.js';
import Book from '../models/Book.js';
import mongoose from 'mongoose';

const addToCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { bookId, quantity = 1 } = req.body; 
    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookInCart = user.cart.some(item => item.book.toString() === bookId);
    if (isBookInCart) {
      return res.status(400).json({ message: "Book is already in the cart" });
    }

    user.cart.push({
      book: bookId,
      quantity,
      addedAt: new Date(),
    });

    await user.save();

    res.status(200).json({ message: "Book added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { bookId } = req.params;
    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookIndex = user.cart.findIndex(item => item.book.toString() === bookId);
    if (bookIndex === -1) {
      return res.status(400).json({ message: "Book is not in the cart" });
    }

    user.cart.splice(bookIndex, 1);

    await user.save();

    res.status(200).json({ message: "Book removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(req.user.id).populate('cart.book');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateCartItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { bookId } = req.params;
    const { quantity } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItemIndex = user.cart.findIndex(
      item => item.book.toString() === bookId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Book not found in cart" });
    }

    user.cart[cartItemIndex].quantity = quantity;

    await user.save();

    await user.populate('cart.book');

    res.status(200).json(user.cart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export { addToCart,removeFromCart,getCart,updateCartItem};
