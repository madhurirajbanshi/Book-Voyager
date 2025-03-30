import React from "react";
import { Link, useNavigate } from "react-router-dom";
const Sidebar = ({ user, loading }) => {
  const navigate = useNavigate();

  return (
    <aside className="bg-white p-6 rounded-xl border-r border-gray-300 w-full h-screen flex flex-col items-center">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : user ? (
        <div className="text-center">
          <img
            src={
              "https://th.bing.com/th/id/OIP.65cr4DZsNGAvYWUr6Rg5qQHaHa?rs=1&pid=ImgDetMain"
            }
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full ml-12 mb-4 border border-gray-300 object-cover"
          />

          <h3 className="font-semibold text-xl  text-gray-600">
            {user.username}
          </h3>
          <p className="text-pink-600 text-sm">{user.email}</p>

          <nav className="mt-5 space-y-3 w-full">
            <SidebarLink to="/profile" label="❤️ Favorites" />
            <SidebarLink to="/profile/orderhistory" label="📦 Order History" />
          </nav>
        </div>
      ) : (
        <p className="text-gray-500">No user data available.</p>
      )}
    </aside>
  );
};

const SidebarLink = ({ to, label }) => (
  <Link
    to={to}
    className="block p-3 text-center bg-pink-100 hover:bg-pink-100 transition-all rounded-lg text-gray-700 font-medium"
  >
    {label}
  </Link>
);

export default Sidebar;
