import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { assests } from "../assets";
import { Link } from "react-router-dom";
import axios from "axios";
import { get } from "react-hook-form";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout, backendUrl, token } = useContext(AppContext);
  const [user, setUser] = useState([])
  const navigate = useNavigate();
  console.log(user);

  const getData = async() => {
    try {
      const res = await axios.get(backendUrl + '/users/me', {headers: {token}});
      setUser(res.data.userData)
      
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <nav className="bg-white shadow-md px-12 py-3 flex justify-between items-center">
      {/* justify-center Places items in the center of the container.
            No extra space between unless you add margins. and 
                justify btw Places items at the extreme ends of the container.
                    Equal space between elements, but no space on the edges.  */}

      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600">SkillSwap</span>
          <img src={assests.skillswaplogo2} alt="logo" className="w-16 h-16" />
        </Link>
      </div>

      {/* Dashboard button */}

      <div className="flex justify-between gap-20">
        <div className="flex space-x-10">

        <button className="px-4 py-2 bg-white-400 text-black rounded-lg border-b-2 hover:bg-blue-600 hover:text-white transition">
          <Link to='/swap-page'> Swaps</Link>
        </button>

        <button className="px-4 py-2 bg-white-400 text-black rounded-lg border-b-2 hover:bg-blue-600 hover:text-white transition">
          <Link to='/announcement'> Announcement</Link>
        </button>

        <button className="px-4 py-2 bg-white-400 text-black rounded-lg border-b-2 hover:bg-blue-600 hover:text-white transition">
          <Link to="/about">About</Link>
        </button>

        <button className="px-4 py-2 bg-white-400 text-black rounded-lg border-b-2 hover:bg-blue-600 hover:text-white transition">
          <Link to="/contact">Contact</Link>
        </button>

        </div>
        

        {/* Profile dropdown */}
        <div className="relative"
  onMouseEnter={() => setDropdownOpen(true)}
  onMouseLeave={() => setDropdownOpen(false)}
>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-4 focus:outline-none"
          >
            {/* 🔹 relative: The element stays in the normal flow (it doesn’t leave its place).

You can move it slightly using top, left, right, bottom.
It also acts as a reference point for absolutely positioned child elements.
👉 The parent has relative. The child with absolute will be positioned relative to this parent, not the whole page.*/}

            <img
              src={`${user.avatarUrl}`}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{user.name}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-4 w-28 bg-white border rounded-lg shadow-lg">
              <ul className="py-2">
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    <Link to="/profile">Profile</Link>
                  </button>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

/**
 * absolute

The element is taken out of normal flow (doesn’t affect siblings).
Positioned relative to the nearest parent with relative (or absolute/fixed/sticky).
If no parent has positioning, it will be relative to the entire <body> (viewport).
👉 The red box will stick to the top-left corner of its green parent.
 */

export default Navbar;
