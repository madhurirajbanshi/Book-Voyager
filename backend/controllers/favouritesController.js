import User from '../models/User.js';
import Book from '../models/Book.js';
import mongoose from 'mongoose';

const addTofavourites = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { bookId } = req.body;
    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    console.log("User ID:", req.user.id);
    console.log("Book ID:", bookId);

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      console.log("Book not found:", bookId);
      return res.status(404).json({ message: "Book not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const isBookInFavourites = user.favourites.some(favBookId => favBookId.toString() === bookId);
    if (isBookInFavourites) {
      return res.status(400).json({ message: "Book is already in favourites" });
    }

    user.favourites.push(bookId);
    await user.save();

    res.status(200).json({ message: "Book added to favourites" });
  } catch (error) {
    console.error("Error adding to favourites:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeFromfavourites = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { bookId } = req.params;
    console.log("Removing book ID:", bookId);

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User's favourites before removal:", user.favourites);

    const bookIdString = bookId.toString();

    const isBookInFavourites = user.favourites.some(favBook => favBook._id.toString() === bookIdString);
    if (!isBookInFavourites) {
      return res.status(400).json({ message: "Book is not in favourites" });
    }

    user.favourites = user.favourites.filter(favBook => favBook._id.toString() !== bookIdString);

    await user.save();

    console.log("User's favourites after removal:", user.favourites);

    res.status(200).json({ message: "Book removed from favourites" });

  } catch (error) {
    console.error("Error removing from favourites:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getFavourites = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(req.user.id).populate('favourites'); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.favourites);
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export { addTofavourites, removeFromfavourites, getFavourites };