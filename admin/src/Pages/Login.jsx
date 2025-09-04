import React, { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // {name, avatar, token}
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", { email, password });

      console.log(res.data.userData)
      
      if (res.data.userData.role != "admin") alert("Access denied, Admin only");

      else if (!res.data.Success) alert("Login Failed!");
      setUser(res.data.userData);

      localStorage.setItem("token", res.data.token); // store jwt
      navigate('/admin/dashboard');
      
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col">
      {/* Navbar */}
      {user && (
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <div className="flex-1 text-center text-xl font-semibold">
            Admin Panel
          </div>
          <div className="flex items-center gap-2">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span>{user.name}</span>
          </div>
        </nav>
      )}

      {/* Login Form */}
      {!user && (
        <div className="flex flex-1 justify-center items-center">
          <form
            onSubmit={handleLogin}
            className="bg-white shadow-lg rounded-lg p-8 w-80"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
              Admin.Login
            </h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded focus:outline-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border rounded focus:outline-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login