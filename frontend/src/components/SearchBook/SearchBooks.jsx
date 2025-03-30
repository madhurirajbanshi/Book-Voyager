import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { IoCartOutline, IoCheckmarkCircle } from "react-icons/io5";
import { toast } from "react-toastify";

const SearchBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Extract search query from URL on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const titleParam = queryParams.get("title");

    if (titleParam) {
      setSearchTerm(titleParam);
      searchBooks(titleParam);
    }
  }, [location.search]);

  // Check user's favorite books and cart items
  useEffect(() => {
    if (token) {
      fetchUserInteractions();
    }
  }, [token]);

  const fetchUserInteractions = async () => {
    if (!token) return;

    try {
      // Fetch user favorites
      const favResponse = await axios.get("http://localhost:5000/favourites", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const favoritesMap = {};
      favResponse.data.forEach((item) => {
        favoritesMap[item.bookId] = true;
      });
      setFavorites(favoritesMap);

      // Fetch user cart
      const cartResponse = await axios.get(
        "http://localhost:5000/cart/getcart",
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      const cartMap = {};
      cartResponse.data.forEach((item) => {
        cartMap[item.bookId] = true;
      });
      setCartItems(cartMap);
    } catch (error) {
      console.error("Error fetching user interactions:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
    }
  };

  const searchBooks = async (term) => {
    const searchFor = term || searchTerm;
    if (!searchFor) return;

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/books/");
      const foundBooks = response.data.data.filter((book) =>
        book.title.toLowerCase().includes(searchFor.toLowerCase())
      );
      setBooks(foundBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    navigate(`/search?title=${encodeURIComponent(searchTerm)}`);
    searchBooks();
  };

  const handleBookClick = (id) => {
    navigate(`/view-book-details/${id}`);
  };

  const handleFavorite = async (e, bookId) => {
    e.stopPropagation(); // Prevent triggering book click

    if (!token) {
      toast.info("Please login to add to favorites");
      return;
    }

    try {
      if (favorites[bookId]) {
        await axios.delete(
          `http://localhost:5000/favourites/remove/${bookId}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setFavorites((prev) => ({ ...prev, [bookId]: false }));
        toast.success("Removed from favorites");
      } else {
        await axios.post(
          "http://localhost:5000/favourites/add",
          { bookId },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setFavorites((prev) => ({ ...prev, [bookId]: true }));
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  const handleCart = async (e, bookId) => {
    e.stopPropagation(); // Prevent triggering book click

    if (!token) {
      toast.info("Please login to add to cart");
      return;
    }

    try {
      if (cartItems[bookId]) {
        await axios.delete(`http://localhost:5000/cart/remove/${bookId}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setCartItems((prev) => ({ ...prev, [bookId]: false }));
        toast.success("Removed from cart");
      } else {
        await axios.post(
          "http://localhost:5000/cart/add",
          { bookId },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setCartItems((prev) => ({ ...prev, [bookId]: true }));
        toast.success("Added to cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-500">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-500">
          ★
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00563B]"></div>
        </div>
      ) : books.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                onClick={() => handleBookClick(book._id)}
                className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="w-1/3 relative">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150x225?text=No+Image";
                    }}
                  />
                  {token && (
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <button
                        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition duration-300"
                        onClick={(e) => handleFavorite(e, book._id)}
                        aria-label={
                          favorites[book._id]
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        {favorites[book._id] ? (
                          <IoIosHeart className="text-red-500 text-xl" />
                        ) : (
                          <IoIosHeartEmpty className="text-red-500 text-xl" />
                        )}
                      </button>
                      <button
                        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition duration-300"
                        onClick={(e) => handleCart(e, book._id)}
                        aria-label={
                          cartItems[book._id]
                            ? "Remove from cart"
                            : "Add to cart"
                        }
                      >
                        {cartItems[book._id] ? (
                          <IoCheckmarkCircle className="text-blue-500 text-xl" />
                        ) : (
                          <IoCartOutline className="text-blue-500 text-xl" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="w-2/3 p-4 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-[#00563B] mb-2">by {book.author}</p>

                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">{renderStars(book.rating)}</div>
                    <span className="text-lg font-bold mr-1">
                      {(book.rating || 4.2).toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({book.ratings || "0"} ratings)
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                    {book.description || "No description available."}
                  </p>

                  {/* View Details button moved to bottom */}
                  <div className="mt-auto">
                    <span className="font-bold text-lg">
                      Rs. {book.price || "499"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookClick(book._id);
                      }}
                      className="px-3 py-1 bg-[#00563B] text-white rounded hover:bg-[#00412A] text-sm w-half mt-4"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : searchTerm ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No books found matching "{searchTerm}"
          </p>
          <p className="mt-2">
            Try a different search term or browse all books
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchBooks;
