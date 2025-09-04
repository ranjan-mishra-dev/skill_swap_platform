import React, { createContext, useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";

// 1️⃣ Create Context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 2️⃣ Global States
  const [backendUrl] = useState("http://localhost:5000/api"); // keep fixed
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  console.log("appcontext", user)
  const navigate = useNavigate()


  // 3️⃣ Login function (store token + user)
  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken); // persist after refresh
    setUser(userData);
  };

  // 4️⃣ Logout function
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");

  };

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        token,
        user,
        setToken,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
