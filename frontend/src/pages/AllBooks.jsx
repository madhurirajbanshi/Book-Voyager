import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard"; 
import axios from "axios";

const AllBooks = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/books/");
        console.log("Fetched Data:", response.data);
        setData(response.data.data); 
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchBooks(); 
  }, []); 

  return (
    <div className="my-4 mx-auto container max-w-screen-2xl md:px-20 px-4">
      {loading ? (
        <Loader /> 
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {data.length > 0 ? (
            data.map((item, i) => (
              <div key={i}>
                <Link to={`/view-book-details/${item.id}`}>
                  <BookCard data={item} /> 
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-5">No books found.</p> 
          )}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
