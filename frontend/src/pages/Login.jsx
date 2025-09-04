import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ✅ Zod schema for validation
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, login, setUser } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    try {
      const res = await axios.post(backendUrl + "/users/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      login(res.data.token, res.data);
      toast.success(`Welcome back, ${res.data.userData.name}!`, {
        position: "top-right",
      });
      setUser(res.data.userData);
      navigate("/");
      if (!res.Success) {
        toast.error(res.message, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.log("Error during login", error.message);
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        {/* Forget Password link */}
        <div className="text-center mt-4 flex justify-between items-center space-x-6">
          <a
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </a>
          <a href="/register" className="text-sm text-blue-500 hover:underline">
            Sign Up!
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
