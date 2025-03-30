import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ data, favourite, onRemove }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto ">
      <Link to={`/view-book-details/${data._id}`}>
        <div className="relative">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-48 object-contain"
          />

          {favourite && (
            <div className="absolute top-3 left-3 bg-white bg-opacity-80 p-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-pink-600"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-5.201-3.48 12.728 12.728 0 01-2.176-2.816c-.897-1.616-1.242-3.095-1.242-4.402 0-3.766 3.083-6.855 6.843-6.855 1.839 0 3.537.711 4.8 1.975 1.263-1.264 2.961-1.975 4.8-1.975 3.76 0 6.843 3.089 6.843 6.855 0 1.307-.345 2.786-1.242 4.402a12.728 12.728 0 01-2.176 2.816 15.247 15.247 0 01-5.201 3.48l-.022.012-.007.003-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 text-center">
        <h3
          className="font-bold text-gray-800 mb-1 truncate"
          title={data.title}
        >
          {data.title}
        </h3>

        <div className="flex justify-center items-center mb-1 space-x-0.5">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={index < 3 ? "#FFD700" : "#e5e7eb"} 
              className="w-5 h-5"
            >
              <path d="M12 17.75l-5.447 2.86 1.04-6.064-4.407-4.294 6.091-.885L12 3.25l2.724 5.117 6.091.885-4.407 4.294 1.04 6.064z" />
            </svg>
          ))}
        </div>

        <p className="text-lg font-semibold text-gray-800 mt-1">
          Rs {data.price}
        </p>
      </div>

      {favourite && (
        <div className="px-4 pb-4 -mt-1">
          <button
            onClick={() => onRemove(data._id)}
            className="w-full py-2 bg-gray-100 text-gray-800 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-200 transition flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-red-600 mr-1"
            >
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clipRule="evenodd"
              />
            </svg>
            Remove from Favorites
          </button>
        </div>
      )}
    </div>
  );
};

export default BookCard;
