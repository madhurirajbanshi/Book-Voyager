import React, { useState, useEffect } from "react";
import { Trash2, ShoppingCart, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import axios from "axios";
import { FiDelete } from "react-icons/fi";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/cart/getcart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(response.data);
      calculateTotal(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setIsLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const cartTotal = items.reduce(
      (sum, item) => sum + (item.book?.price || 0) * item.quantity,
      0
    );
    setTotal(cartTotal);
  };

  const addToCart = async (book) => {
    try {
      const token = localStorage.getItem("token");

      const existingItemIndex = cartItems.findIndex(
        (item) => item.book._id === book._id
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += 1;

        await axios.patch(
          `http://localhost:5000/cart/update/${book._id}`,
          { quantity: updatedCart[existingItemIndex].quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCartItems(updatedCart);
        calculateTotal(updatedCart);
      } else {
        const response = await axios.post(
          "http://localhost:5000/cart/add",
          { bookId: book._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedCartResponse = await axios.get(
          "http://localhost:5000/cart/getcart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCartItems(updatedCartResponse.data);
        calculateTotal(updatedCartResponse.data);
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const updateQuantity = async (bookId, change) => {
    const newQuantity =
      cartItems.find((item) => item.book._id === bookId).quantity + change;

    if (newQuantity < 1) {
      await removeFromCart(bookId);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/cart/update/${bookId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCart = cartItems.map((item) =>
        item.book._id === bookId ? { ...item, quantity: newQuantity } : item
      );

      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/cart/remove/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedCart = cartItems.filter((item) => item && item.book && item.book._id !== bookId);
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleCheckboxChange = (bookId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(bookId)) {
        return prevSelectedItems.filter((id) => id !== bookId);
      } else {
        return [...prevSelectedItems, bookId];
      }
    });
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
    const validCartItems = cartItems.filter(
  (item) => item && item.book && item.book._id
    );
      const orderData = {
        items: validCartItems
          .filter((item) => selectedItems.includes(item.book._id))
          .map((item) => ({
            bookId: item.book._id,
            quantity: item.quantity,
            price: item.book.price,
          })),
        totalAmount: selectedItems.reduce((sum, bookId) => {
          const foundItem = validCartItems.find(
            (item) => item.book._id === bookId
          );
          return foundItem
            ? sum + foundItem.book.price * foundItem.quantity
            : sum;
        }, 0),
        status: "Order Placed",
      };
        if (orderData.items.length === 0) {
          alert("No valid items selected for order");
          return;
        }

      await axios.post("http://localhost:5000/orders/place", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const uuid = uuidv4();
      const secretKey = "8gBm/:&EnhH.1/q";

      const data = `total_amount=${total},transaction_uuid=${uuid},product_code=EPAYTEST`;

      const hash = CryptoJS.HmacSHA256(data, secretKey);
      const base64Hash = CryptoJS.enc.Base64.stringify(hash);

      const formData = {
        amount: total,
        tax_amount: "0",
        total_amount: total,
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
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
              <ShoppingCart className="mr-3 text-blue-600" size={32} />
              Your Cart
            </h2>
            <span className="text-xl font-semibold text-gray-700">
              {cartItems.length} Items
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <AnimatePresence>
              {cartItems?.map((item) =>
                item?.book ? (
                  <motion.div
                    key={item.book._id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex items-center border-b py-4 hover:bg-gray-50 transition-colors"
                  >
                    {item?.book?.image && (
                      <img
                        src={item.book.image}
                        alt={item.book.title}
                        className="w-24 h-32 object-cover rounded-md mr-6"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item?.book?.title}
                      </h3>
                      <p className="text-gray-600">Rs.{item?.book?.price}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item?.book?._id, -1)}
                          className="px-2 py-1 bg-gray-200 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 bg-gray-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item?.book?._id, 1)}
                          className="px-2 py-1 bg-gray-200 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item?.book?._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FiDelete />
                    </button>
                    <div className="flex items-center ml-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item?.book?._id)}
                        onChange={() => handleCheckboxChange(item?.book?._id)}
                        className="mr-2"
                      />
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          )}

          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                Total: Rs.{total.toFixed(2)}
              </p>
              <p className="text-gray-500">
                Shipping and taxes calculated at checkout
              </p>
            </div>
            <div>
              <button
                onClick={handlePayment}
                disabled={selectedItems.length === 0} // Disable button if no items are selected
                className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-gray-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
