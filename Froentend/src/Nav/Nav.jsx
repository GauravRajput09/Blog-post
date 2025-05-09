import React from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


const Navbar = () => {
  const navigate = useNavigate();

  const handleSelectChange = (e) => {
    const path = e.target.value;
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate("/")}
              className="text-lg font-bold text-white hover:text-red-600 transition-colors duration-300"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/addpost")}
              className="text-lg font-bold text-white hover:text-red-600 transition-colors duration-300"
            >
              Add Post
            </button>
          </div>

          <div>
            <select
              onChange={handleSelectChange}
              defaultValue=""
              className="text-gray-800 font-medium border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-gray-400 transition duration-200"
            >
              <option disabled value="">
                Account
              </option>
              <option value="/signup">Signup</option>
              <option value="/login">Login</option>
              <option value="/logout">Logout</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
