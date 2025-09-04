import React, { useState } from "react";
import axios from "axios";

const Announcement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const token = localStorage.getItem("token"); // store after login
      await axios.post("http://localhost:5000/api/admin/announcement", 
        { title, message },
        { headers: {token}  }
      );
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
<div className="flex items-center justify-center min-h-screen bg-gray-100">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md p-6 bg-white rounded-xl shadow-md space-y-4"
  >
    <h2 className="text-2xl font-bold text-center text-blue-600">
      Create Announcement
    </h2>

    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter title"
      required
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Enter message"
      required
      rows="4"
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
    >
      📢 Publish
    </button>
  </form>
</div>

  );
}
export default Announcement