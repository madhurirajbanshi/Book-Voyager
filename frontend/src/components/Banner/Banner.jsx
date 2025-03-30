import React from "react";
import { useNavigate } from "react-router-dom";
import Booklogo from "../../../public/bookimage.jpg";

const Banner = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/AllBooks");
  };

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row my-10">
      <div className="w-full order-2 md:order-1 md:w-1/2 mt-8 md:mt-28">
        <div className="space-y-6">
          <h1 className="text-2xl md:text-4xl font-bold">
            Welcome to PageVoyage!{" "}
            <span className="text-pink-500">Turn Pages, Unlock Worlds</span>
          </h1>
          <p className="text-sm md:text-xl">
            At PageVoyage, each page opens new worlds of knowledge and
            imagination. Whether you're exploring classics, mysteries, or
            gaining new insights, we bring the joy of books to you.
          </p>
          <p>✨ Read. Learn. Explore. Your journey starts here!</p>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input type="text" className="grow py-1" placeholder="Email" />
          </label>
        </div>
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 mt-6"
          onClick={handleGetStartedClick}
        >
          Get Started
        </button>
      </div>
      <div className="order-1 w-full mt-0 md:w-1/2">
        <img
          src={Booklogo}
          className="md:w-[550px] md:h-[600px] md:ml-10"
          alt="Books"
        />
      </div>
    </div>
  );
};

export default Banner;
