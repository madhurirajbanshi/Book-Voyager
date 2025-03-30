import React from "react";
import { useNavigate } from "react-router-dom";
const BookSection = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/AllBooks");
  };
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 py-10 bg-white max-w-7xl mx-auto gap-x-12">
      <div className="w-full md:w-2/5 relative">
        <div className="w-full h-full bg-gray-100 overflow-hidden rounded-lg shadow-lg">
          <div className="flex flex-wrap justify-center">
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1721741833i/215805908.jpg"
              alt="Book 1"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1735972794i/223242502.jpg"
              alt="Book 2"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1728566110i/211004934.jpg"
              alt="Book 3"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1730829069i/216017423.jpg"
              alt="Book 4"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1719586016i/212808316.jpg"
              alt="Book 5"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1692281423i/195888874.jpg"
              alt="Book 6"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1718903208i/209245365.jpg"
              alt="Book 6"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1721154938i/214974640.jpg"
              alt="Book 6"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1719586016i/212808316.jpg"
              alt="Book 5"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1721741833i/215805908.jpg"
              alt="Book 1"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1735972794i/223242502.jpg"
              alt="Book 2"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1731549824i/221499143.jpg"
              alt="Book 6"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1718635526i/213243938.jpg"
              alt="Book 6"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1702763723i/175399563.jpg"
              alt="Book 6"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
            <img
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1719270037i/215192073.jpg"
              alt="Book 6"
              className="w-1/4 sm:w-1/5 h-auto object-cover"
            />
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 text-center md:text-left mt-4 md:mt-0 md:pl-12">
        <h2 className="text-xl font-bold font-poppins">
          Find Your Favorite <span className="text-pink-600">Book Here!</span>
        </h2>
        <p className="text-gray-600 mt-3 text-sm font-roboto">
          Ready to set sail into a world of captivating stories and insightful
          knowledge? Explore our vast collection of books, dive into new
          adventures, and uncover the gems of literature. Your next great read
          awaits!
        </p>
        {/* Statistics */}
        <div className="flex justify-center md:justify-start mt-4 space-x-6">
          <div>
            <h3 className="text-lg font-bold font-poppins">800+</h3>
            <p className="text-xs text-gray-500">Book Listings</p>
          </div>
          <div>
            <h3 className="text-lg font-bold font-poppins">550+</h3>
            <p className="text-xs text-gray-500">Registered Users</p>
          </div>
          <div>
            <h3 className="text-lg font-bold font-poppins">1200+</h3>
            <p className="text-xs text-gray-500">PDFs Downloaded</p>
          </div>
        </div>
        <button
          className="mt-4 bg-pink-600 text-white px-6 py-3 rounded shadow-md hover:bg-pink-700 transition"
          onClick={handleExplore}
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default BookSection;
