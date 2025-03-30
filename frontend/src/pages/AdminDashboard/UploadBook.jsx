import React, { useState } from "react";

const UploadBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "Fiction",
    price: "",
    publishedDate: "",
    image: "",
    stock: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Book Data:", formData);

    try {
      const response = await fetch("http://localhost:5000/books/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Book uploaded successfully:", data);

        setFormData({
          title: "",
          author: "",
          description: "",
          category: "Fiction",
          price: "",
          publishedDate: "",
          image: "",
          stock: "",
        });

        setSuccessMessage("Book uploaded successfully!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        console.error("Error uploading book:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading book:", error);
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
            value={formData.title}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={formData.author}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="image"
            placeholder="Book Image URL"
            value={formData.image}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          >
            <option value="Fiction">Fiction</option>
            <option value="Science">Science</option>
            <option value="Biography">Biography</option>
            <option value="Horror">Horror</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Romance">Romance</option>
            <option value="Science Fiction">Science Fiction</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
          <input
            type="date"
            name="publishedDate"
            value={formData.publishedDate}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />
        </div>

        <textarea
          name="description"
          placeholder="Book Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          rows="4"
        />

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-60 bg-green-800 text-white py-2 rounded"
          >
           Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadBook;
