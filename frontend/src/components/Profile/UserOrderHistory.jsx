import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:5000/orders/getorders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data.orders);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      setOrders([]);
      setError(null);
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen mt-10 p-4 sm:p-6 md:p-8">
      {orders.length === 0 ? (
        <p className="text-lg text-gray-600 text-center">
          No order history available.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg border shadow-md text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-2 sm:p-3 text-left">Order ID</th>
                  <th className="p-2 sm:p-3 text-left">Book Title</th>
                  <th className="p-2 sm:p-3 text-left">Status</th>
                  <th className="p-2 sm:p-3 text-left">Price</th>
                  <th className="p-2 sm:p-3 text-left">Stock</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="p-2 sm:p-3">{order._id}</td>
                    <td className="p-2 sm:p-3">
                      {order.book ? order.book.title : "N/A"}
                    </td>
                    <td className="p-2 sm:p-3">{order.status}</td>
                    <td className="p-2 sm:p-3">
                      Rs.{order.book ? order.book.price : "N/A"}
                    </td>
                    <td className="p-2 sm:p-3">
                      {order.book ? order.book.stock : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageClick(index + 1)}
                  className={`px-3 py-2 text-xs sm:text-sm rounded-full transition duration-200 ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserOrderHistory;
