import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditBook = ({ book, setEditingBook, setBooks }) => {
  const [editedBook, setEditedBook] = useState(book);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEditedBook(book);
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBook({ ...editedBook, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Edited Book Data:", editedBook);

    const token = localStorage.getItem("token");
    console.log("Token retrieved from localStorage: ", token); 

    if (!token) {
      console.error("No token found");
      
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/books/${editedBook._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify(editedBook),
        }
      );

      if (response.ok) {
        setSuccessMessage("Book updated successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          setEditingBook(null);
          setBooks((prevBooks) =>
            prevBooks.map((book) =>
              book._id === editedBook._id ? editedBook : book
            )
          );
          navigate("/Managebook"); 
        }, 2000);
      } else {
        console.error("Failed to update book");
      }
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">

      {successMessage && (
        <p className="text-green-600 text-center mb-4">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={editedBook.title}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={editedBook.author}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="image"
            placeholder="Book Image URL"
            value={editedBook.image}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
          <select
            name="category"
            value={editedBook.category}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          >
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="Biography">Biography</option>
            <option value="Biography">Horror</option>
            <option value="Biography">Fantasy</option>
            <option value="Biography">Romance</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={editedBook.price}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
          <input
            type="date"
            name="publishedDate"
            value={editedBook.publishedDate}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={editedBook.stock}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
        </div>

        <textarea
          name="description"
          placeholder="Book Description"
          value={editedBook.description}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          rows="4"
        />

        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="w-60 bg-green-600 text-white py-3 rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setEditingBook(null)}
            className="w-60 bg-gray-400 text-white py-3 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
