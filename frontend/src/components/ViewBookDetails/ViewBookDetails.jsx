import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { IoCartOutline, IoCheckmarkCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/books/");
        const bookDetails = response.data.data.find((item) => item._id === id);
        if (bookDetails) {
          setBook(bookDetails);
        } else {
          toast.error("Book not found");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/feedback");
        const bookFeedbacks = response.data.data.filter(
          (item) => item.bookId === id
        );
        setFeedbacks(bookFeedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        toast.error("Failed to load feedbacks");
      }
    };

    const checkUserInteractions = async () => {
      if (!token) return;

      try {
        const userResponse = await axios.get(
          "http://localhost:5000/auth/userinformation",
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrentUser(userResponse.data);

        const favResponse = await axios.get(
          "http://localhost:5000/favourites",
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFavorite(favResponse.data.some((item) => item.bookId === id));

        const cartResponse = await axios.get("http://localhost:5000/cart/getcart", {
          headers: { authorization: `Bearer ${token}` },
        });

        setIsInCart(cartResponse.data.some((item) => item.bookId === id));

        // }
      } catch (error) {
        console.error("Error checking user interactions:", error);
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    };

    fetchBookDetails();
    fetchFeedbacks();
    checkUserInteractions();
  }, [id]);

  const handleFavourite = async () => {
    if (!localStorage.getItem("token")) {
      toast.info("Please login to add to favorites");
      setIsDropdownOpen(true);
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(
          `http://localhost:5000/favourites/remove/${book._id}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await axios.post(
          "http://localhost:5000/favourites/add",
          { bookId: book._id },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error(
        "Error updating favorites:",
        error.response?.data || error.message
      );
      toast.error("Failed to update favorites");
    }
  };

  const handleCart = async () => {
    if (!localStorage.getItem("token")) {
      toast.info("Please login to add to cart");
      setIsDropdownOpen(true);
      return;
    }

    try {
      if (isInCart) {
        await axios.delete(`http://localhost:5000/cart/remove/${book._id}`, {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setIsInCart(false);
        toast.success("Removed from cart");
      } else {
        await axios.post(
          "http://localhost:5000/cart/add",
          { bookId: book._id },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsInCart(true);
        toast.success("Added to cart");
      }
    } catch (error) {
      console.error(
        "Error updating cart:",
        error.response?.data || error.message
      );
      toast.error("Failed to update cart");
    }
  };

  const handleRating = async (newRating) => {
    if (!localStorage.getItem("token")) {
      toast.info("Please login to rate this book");
      setIsDropdownOpen(true);
      return;
    }

    setUserRating(newRating);

    try {
      await axios.post(
        "http://localhost:5000/books/rate",
        {
          bookId: book._id,
          rating: newRating,
        },
        {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Rating submitted successfully");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating");
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!localStorage.getItem("token")) {
      toast.info("Please login to submit feedback");
      setIsDropdownOpen(true);
      return;
    }

    if (!feedback.trim()) {
      toast.warning("Please enter your feedback before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/feedback/add",
        {
          bookId: book._id,
          feedback: feedback,
        },
        {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setFeedbacks([response.data.data, ...feedbacks]);
      setFeedback("");
      toast.success("Feedback submitted successfully");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await axios.delete(`http://localhost:5000/feedback/${feedbackId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setFeedbacks(feedbacks.filter((item) => item._id !== feedbackId));
      toast.success("Feedback deleted successfully");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-500 text-2xl">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-500 text-2xl">
          ★
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300 text-2xl">
          ★
        </span>
      );
    }

    return stars;
  };

  const renderUserRatingStars = () => {
    return (
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-3xl cursor-pointer transition-all duration-200 hover:scale-110 ${
              userRating >= star ? "text-yellow-500" : "text-gray-300"
            }`}
            onClick={() => handleRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const openImageInNewTab = (image) => {
    window.open(image, "_blank"); 
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePayment = (book) => {
    const uuid = uuidv4();
    const secretKey = "8gBm/:&EnhH.1/q";

    // generate signature
    const data = `total_amount=${book.price},transaction_uuid=${uuid},product_code=EPAYTEST`; 

    const hash = CryptoJS.HmacSHA256(data, secretKey);

    // Convert hash to Base64
    const base64Hash = CryptoJS.enc.Base64.stringify(hash);
    const formData = {
      amount: book.price,
      tax_amount: "0",
      total_amount: book.price,
      transaction_uuid: uuid,
      product_code: "EPAYTEST",
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: "https://developer.esewa.com.np/success",
      failure_url: "https://developer.esewa.com.np/failure",
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: base64Hash,
    };

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    Object.keys(formData).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = formData[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
      window.location.href = "/";
  };

  if (loading) return <Loader />;
  if (!book)
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-center text-xl text-gray-600 mb-4">
          Book not found.
        </p>
        <button
          onClick={() => navigate("/books")}
          className="px-6 py-2 bg-[#00563B] text-white rounded-full hover:bg-[#00412A] transition duration-300"
        >
          Browse Other Books
        </button>
      </div>
    );

  return (
    <div className="container mx-auto px-4    mt-8 md:px-16 py-8 ">
      <div className="flex flex-col md:flex-row  gap-8 items-start">
        <div className="w-full md:w-1/4 flex flex-col  items-center">
          <div className="relative w-full max-w-xs">
            <img
              src={book.image}
              alt={book.image}
              onClick={() => openImageInNewTab(book.image)}
              style={{ cursor: "pointer", height: "425px" }}
              className="w-full object-cover rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            />

            {currentUser && (
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <button
                  className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition duration-300"
                  onClick={handleFavourite}
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  {isFavorite ? (
                    <IoIosHeart className="text-red-500 text-2xl" />
                  ) : (
                    <IoIosHeartEmpty className="text-red-500 text-2xl" />
                  )}
                </button>
                <button
                  className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition duration-300"
                  onClick={handleCart}
                  aria-label={isInCart ? "Remove from cart" : "Add to cart"}
                >
                  {isInCart ? (
                    <IoCheckmarkCircle className="text-blue-500 text-2xl" />
                  ) : (
                    <IoCartOutline className="text-blue-500 text-2xl" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 w-full max-w-xs">
            <div className="relative w-full">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full py-3 bg-[#00563B] text-white rounded-full hover:bg-[#00412A] transition duration-300 flex items-center justify-center gap-2"
              >
                <span>Want to Read</span>
                <span>{isDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-2 z-10">
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 transition duration-200"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 transition duration-200"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>

            {/* Price Button */}
            <button
              onClick={() => handlePayment(book)}
              className="mt-4 w-full py-3 border-2 border-[#00563B] text-[#00563B] rounded-full hover:bg-[#00563B] hover:text-white transition duration-300"
            >
              Buy for Rs {book.price || "499"}
            </button>
          </div>
        </div>

        <div className="w-full md:w-3/4 text-gray-800">
          <div className="bg-white mb-15 rounded-lg shadow-sm p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-0 mt-[-16px]">
              {book.title}
            </h1>

            <div className="flex items-center mt-2">
              <Link
                to={`/author/${book.author}`}
                className="text-lg font-medium hover:underline text-[#00563B]"
              >
                {book.author}
              </Link>
              {book.verified && (
                <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <IoCheckmarkCircle className="mr-1" />
                  Verified Author
                </span>
              )}
            </div>

            <div className="flex items-center mt-4">
              <div className="flex mr-2">{renderStars(book.rating || 4.2)}</div>
              <span className="text-2xl font-bold mr-2">
                {(book.rating || 4.2).toFixed(1)}
              </span>
              <span className="text-gray-500">
                {book.ratings || "7,784"} ratings · {book.reviews || "2,642"}{" "}
                reviews
              </span>
            </div>

            <div>
              <p className="mt-6 leading-relaxed font-semibold text-black-700 text-justify max-w-xl">
                {book.description ||
                  "Brimming with magic and romance, a young fairy queen must form an unlikely alliance or risk an unspeakable danger destroying all she holds dear in this standalone YA novel from a bestselling author."}
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-bold">This Edition</h3>
                <p className="mt-2">
                  <strong>Format:</strong> 400 pages, Hardcover
                </p>
                <p className="mt-2">
                  <strong>Published:</strong> February 4, 2025 by Disney Press
                </p>
                <p className="mt-2">
                  <strong>ISBN:</strong> 9781368098458 (ISBN10: 1368098452)
                </p>
                <p className="mt-2">
                  <strong>ASIN:</strong> 1368098452
                </p>
                <p className="mt-2">
                  <strong>Language:</strong> English
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm p-3">
            <h2 className="text-2xl mt-10 font-bold text-gray-800 mb-4">
              Share your thoughts
            </h2>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-1/2 p-10 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#00563B] focus:border-transparent transition duration-200"
              rows="3"
              placeholder="Your feedback..."
            />

            <div className="flex justify-start">
              <button
                onClick={handleFeedbackSubmit}
                disabled={isSubmitting || !feedback.trim()}
                className={`px-2 py-3 rounded-md transition duration-300 ${
                  isSubmitting || !feedback.trim()
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#00563B] text-white hover:bg-[#00412A]"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>

          {/* Reader Feedbacks Display Section */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Reader Reviews {feedbacks.length > 0 && `(${feedbacks.length})`}
            </h2>

            {feedbacks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {feedbacks.map((item) => (
                  <div
                    key={item._id}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#00563B] text-white rounded-full flex items-center justify-center font-bold">
                          {item.username
                            ? item.username.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold">
                            {item.currentUser || "Anonymous Reader"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Delete button - only visible to the feedback owner */}
                      {currentUser && currentUser._id === item.userId && (
                        <button
                          onClick={() => handleDeleteFeedback(item._id)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="mt-3 text-gray-700">{item.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBookDetails;
