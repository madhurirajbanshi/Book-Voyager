import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { RiChatDeleteLine } from "react-icons/ri";

const ManageBooks = ({ onNavigate, setEditingBook }) => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 4;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/books/");
        const result = await response.json();

        if (result.status === "Success" && Array.isArray(result.data)) {
          setBooks(result.data);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setBooks(books.filter((book) => book._id !== id));
      } else {
        console.error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const totalPages = Math.ceil(books.length / booksPerPage);
  const currentBooks = books.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  return (
    <div className="p-4 bg-white mt-8 rounded-lg shadow-md">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">
                Author
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.length > 0 ? (
              currentBooks.map((book) => (
                <tr key={book._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{book.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {book.author}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {book.category}
                  </td>
                  <td className="px-4 py-3">Rs.{book.price}</td>
                  <td className="px-4 py-3 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="p-2 text-green-500 bg-green-100 rounded hover:bg-green-200"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="p-2 text-red-500 bg-red-100 rounded hover:bg-red-200"
                    >
                      <RiChatDeleteLine />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-3 text-center">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-1 py-1 text-sm rounded-full ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageBooks;
