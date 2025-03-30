import Order from "../models/Order.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount, status = "Order placed" } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items selected for order" });
    }

    // Validate each book exists and has correct pricing
    const validateItems = await Promise.all(
      items.map(async (item) => {
        const book = await Book.findById(item.bookId);
        if (!book) {
          throw new Error(`Book with ID ${item.bookId} not found`);
        }
        return {
          user: userId,
          book: item.bookId,
          quantity: item.quantity,
          price: book.price,
          status:  "Order placed",
        };
      })
    );

    const createdOrders = await Order.insertMany(validateItems);

    // Add orders to user's order history
    user.orders.push(...createdOrders.map((order) => order._id));

    // Optional: Remove ordered items from cart
    user.cart = user.cart.filter(
      (cartItem) =>
        !items.some(
          (orderItem) => orderItem.bookId === cartItem.book.toString()
        )
    );

    await user.save();

    res.status(201).json({
      message: "Order placed successfully",
      orders: createdOrders,
      totalAmount,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Populate the book information for each order
    const user = await User.findById(userId).populate({
      path: "orders",
        populate: { path: "book", model: "Books" }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.orders.length === 0) {
      return res.status(200).json({ message: "No orders found for this user", orders: [] });
    }
    
    res.status(200).json({ message: "Orders retrieved successfully", orders: user.orders });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    
    const { orderId, status } = req.body;
    
    const validStatuses = ["Order placed", "Out for delivery", "Delivered", "Canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    order.status = status;
    await order.save();
    
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { placeOrder, getUserOrders, updateOrder };