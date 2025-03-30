import React, { useState } from "react";
import { Link } from "react-router-dom";
import UploadBook from "./UploadBook";
import ManageBooks from "./ManageBooks";
import EditBook from "./EditBook";
import Users from "./Users";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoMdBook } from "react-icons/io";
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("manageBooks");
  const [editingBook, setEditingBook] = useState(null);



  return (
    <div className="flex flex-col mt-10 min-h-screen">
      {" "}
      <div className="flex flex-grow">
        <aside className="w-64 bg-white shadow-md p-8 flex flex-col">
          <nav className="flex-1 space-y-4">
            <Link
              to="#"
              onClick={() => setActiveSection("uploadBook")}
              className="flex items-center gap-2 px-4 py-3 mt-12 text-gray-700 bg-pink-200 rounded-lg"
            >
              <IoIosAddCircleOutline />
              <span>Upload Book</span>
            </Link>

            <Link
              to="#"
              onClick={() => setActiveSection("manageBooks")}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 bg-pink-200 rounded-lg"
            >
              <IoMdBook />
              <span>Manage Books</span>
            </Link>
            <Link
              to="#"
              onClick={() => setActiveSection("users")}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 bg-pink-200 rounded-lg"
            >
              <IoMdBook />
              <span> Users</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8 bg-white-50">
          {editingBook ? (
            <EditBook book={editingBook} setEditingBook={setEditingBook} />
          ) : (
            <>
              {activeSection === "uploadBook" && <UploadBook />}
              {activeSection === "manageBooks" && (
                <ManageBooks
                  onNavigate={setActiveSection}
                  setEditingBook={setEditingBook}
                />
              )}
              {activeSection === "users" && <Users />}

              {activeSection === "dashboard" && <DashboardContent />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const DashboardContent = () => (
  <div className="bg-whit rounded-lg p-6">
  </div>
);

export default AdminDashboard;
