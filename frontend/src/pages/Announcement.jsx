import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import {toast} from 'react-toastify'


const socket = io("http://localhost:5000");

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Load old announcements
    axios.get("http://localhost:5000/api/admin/announcements")
      .then(res => setAnnouncements(res.data));

    // Listen for real-time updates
    socket.on("newAnnouncement", (data) => {
      setAnnouncements(prev => [data, ...prev]);

      toast.info(`📢 SkillSwap: ${data.title}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    });

    return () => {
      socket.off("newAnnouncement");
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 my-5 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        📢 Announcements
      </h2>

      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements yet.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((a) => (
            <li
              key={a._id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-blue-600">
                {a.title}
              </h3>
              <p className="text-gray-700">{a.message}</p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(a.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Announcements;
