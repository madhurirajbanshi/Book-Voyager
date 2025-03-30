import React from "react";
import { FaStar, FaUserCircle } from "react-icons/fa"; 

const Feedback = () => {
  const feedbacks = [
    {
      text: "A Timeless Classic That Captures the Essence of the Jazz Age. F. Scott Fitzgerald’s The Great Gatsby is an iconic masterpiece that brings the roaring twenties to life. The themes of love, wealth, and tragedy are timeless, and this book never fails to leave a lasting impression. The complex characters and the tragic end of Gatsby's pursuit of his dreams offer rich, layered storytelling that resonates deeply.",
      rating: 5,
      name: "Roshani Karki",
    },
    {
      text: "James Clear's Atomic Habits has been a game-changer in my life. The actionable steps, combined with real-world examples, have helped me develop healthier routines. The book emphasizes small, consistent changes, and I’ve noticed a significant improvement in my personal and professional growth since reading it.",
      rating: 4,
      name: "Jane Smith",
    },
    {
      text: "I highly recommend Rich Dad Poor Dad by Robert Kiyosaki for anyone looking to rethink their approach to money and investing. The contrast between the ‘rich’ and ‘poor’ mindsets was eye-opening, and it challenged my preconceived notions about money, wealth-building, and financial freedom. A great starting point for those new to personal finance.",
      rating: 4,
      name: "Ismarika Sendang",
    },
  ];

  return (
    <div className="p-8 bg-white  flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 ">
        📖 Readers' Feedback
      </h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {feedbacks.map((feedback, index) => (
          <div
            key={index}
            className="relative bg-white bg-opacity-90 shadow-lg rounded-2xl p-3 flex flex-col transform transition-all hover:scale-105 hover:shadow-2xl duration-300 w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <FaUserCircle className="text-gray-700 text-4xl " />
                <p className="text-gray-600 font-semibold">{feedback.name}</p>
              </div>

              <div className="flex space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={`text-yellow-500 ${
                      i < feedback.rating ? "fill-current" : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-800 font-medium text-base leading-relaxed text-justify">
              "{feedback.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
