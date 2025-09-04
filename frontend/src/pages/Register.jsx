import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../schema/userSchema";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

  const {setUser, setToken} = useContext(AppContext)
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      current_password: "",
      location: "",
      skillsOffered: [""],
      skillsWanted: [""],
      availability: {
        weekends: false,
        weekdaysEvenings: false,
        weekdaysDaytime: false,
      },
      isPublic: true,
      bio: "",
    },
  });

 const onSubmit = async (data) => {
    try {
      console.log(data)
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        data, // else u were using fetch("/url", { method:"POST", body: JSON.stringify(data) })  // longer
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ User registered:", res.data);
      console.log(res.data.token)
      setToken(res.data.token)
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      navigate("/");

      alert("User registered successfully!");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("User already exists! Redirecting to login...");
        navigate("/login")
      } else {
        console.error("❌ Error registering user:", error.response?.data || error.message);
        alert("try again!");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        User Registration Form
      </h2>

         <div className="text-center mt-4 flex justify-end items-center space-x-6">
  <a
    href="/login"
    className="text-sm text-blue-500 hover:underline"
  >
    Login!
  </a>
</div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            {...register("name")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            {...register("current_password")}
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter password"
          />
          {errors.current_password && (
            <p className="text-red-500 text-sm">
              {errors.current_password.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            {...register("location")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="City / Country"
          />
        </div>

        {/* Skills Offered */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Skills Offered
          </label>
          <input
            {...register("skillsOffered")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Photoshop, Excel"
          />
        </div>

        {/* Skills Wanted */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Skills Wanted
          </label>
          <input
            {...register("skillsWanted")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. React, Node.js"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium mb-1">Availability</label>
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("availability.weekends")} />
              Weekends
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("availability.weekdaysEvenings")}
              />
              Weekday Evenings
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("availability.weekdaysDaytime")}
              />
              Weekday Daytime
            </label>
          </div>
        </div>

        {/* Public Profile */}
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("isPublic")} defaultChecked />
          <label className="text-sm font-medium">Make Profile Public</label>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            {...register("bio")}
            rows="3"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Tell us about yourself...[max 500 character]"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      
    </div>
  );
};

export default Register;
