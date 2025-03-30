import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { FaCartArrowDown, FaUserCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const isLoggedIn =
    !!localStorage.getItem("token") || !!sessionStorage.getItem("token");

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    // Add the event listener when menu is open
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Remove the listener when component unmounts or menu closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const links = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/allbooks" },
    ...(isLoggedIn
      ? [
          {
            title: <FaCartArrowDown className="text-2xl text-gray-600" />,
            link: "/cart",
          },
          {
            title: <MdDashboard className="text-2xl text-gray-600" />,
            link: "/AdminDashboard?section=manageBooks",
          },
        ]
      : []),
  ];

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        navigate(`/search?title=${searchQuery}`);
        setMenuOpen(false); // Close menu after search
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("userId");
    navigate("/login");
  };

  // Close menu when a navigation link is clicked
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      className={`px-6 md:px-10 py-3 transition-all duration-300 border-b ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex items-center justify-between max-w-screen mx-auto">
        <div className="flex items-center space-x-3">
          <img
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="PageVoyage Logo"
            className="h-10 w-10"
          />
          <h1 className="text-3xl text-pink-600 font-bold">PageVoyage</h1>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl focus:outline-none"
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Add backdrop overlay when menu is open on mobile */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setMenuOpen(false)}
          ></div>
        )}

        <div
          ref={menuRef}
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col justify-center md:flex-row items-center gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-900 bg-opacity-90 md:bg-transparent shadow-lg md:shadow-none md:rounded-none p-4 md:p-0 transition-all duration-300 ease-in-out z-20`}
        >
          {/* Close button for mobile view */}
          <button
            className="absolute top-2 right-2 text-xl md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <FiX />
          </button>

          <div className="flex flex-col from-neutral-100 md:flex-row gap-6 justify-center items-center">
            {links.map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="text-xl md:text-xl"
                onClick={handleNavLinkClick}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="relative w-64 flex-grow">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-12 pr-4 py-2 px-10 w-full rounded-full border outline-none"
            />
            <FiSearch
              className="absolute right-4 top-3 text-lg cursor-pointer"
              onClick={handleSearch}
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-xl transition-all duration-300"
            >
              {darkMode ? "🌞" : "🌙"}
            </button>

            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:text-blue-500 transition-all duration-300"
                >
                  <FaUserCircle className="h-7 w-7 text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute bg-white shadow-lg rounded-md mt-2 right-0 w-20 z-30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-black-700 hover:bg-black-200"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-8 py-2 text-gray-500 hover:bg-gray-200"
                    >
                      <IoExitOutline />
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isLoggedIn && (
              <div className="flex gap-4">
                <Link
                  to="/LogIn"
                  className="px-4 py-2 border border-pink-500 text-pink-500 rounded-full font-semibold transition-all"
                  onClick={handleNavLinkClick}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
