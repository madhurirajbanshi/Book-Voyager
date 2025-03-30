import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Banner from "./components/Banner/Banner";
import RecentlyAdded from "./components/Home/RecentlyAdded";
import BookSection from "./components/BookSection/BookSection";
import Feedback from "./components/Feedback/Feedback";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AllBooks from "./pages/AllBooks";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import SearchBooks from "./components/SearchBook/SearchBooks";
import Favourite from "./components/Profile/Favourite";
import ViewBookDetails from "./components/ViewBookDetails/ViewBookDetails";
import UserOrderHistory from "./components/Profile/UserOrderHistory";
const PrivateRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return element;
};

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <RecentlyAdded />
              <BookSection />
              <Feedback />
            </>
          }
        />
        <Route path="/allbooks" element={<AllBooks />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchBooks />} />

        <Route path="/profile" element={<PrivateRoute element={<Profile />} />}>
          <Route index element={<Favourite />} />
          <Route path="orderhistory" element={<UserOrderHistory />} />
        </Route>
        <Route path="/view-book-details/:id" element={<ViewBookDetails />} />

        <Route
          path="/AdminDashboard"
          element={
            <PrivateRoute element={<AdminDashboard />} requiredRole="admin" />
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
