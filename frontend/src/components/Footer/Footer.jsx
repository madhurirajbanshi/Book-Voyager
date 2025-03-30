import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black py-8 shadow-md mt-6">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-pink-600">
              About Us
            </h3>
            <p className="text-gray-600">
              Book Inventory System helps you manage books efficiently, track
              stock, and keep records effortlessly.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-pink-600">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Home", "Inventory", "Add Book", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-pink-600 transition duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-pink-600">
              Contact Us
            </h3>
            <p className="text-gray-600">Email: support@bookinventory.com</p>
            <p className="text-gray-600">Phone: +123 456 7890</p>
            <p className="text-gray-600">Address: 123 Library St, Booktown</p>

            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-6 pt-4 text-center text-gray-600">
          <p>&copy; 2025 Book Inventory System | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
