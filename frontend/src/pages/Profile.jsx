import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

// ✅ Zod Schema
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  location: z.string().optional(),
  bio: z.string().optional(),
  skillsOffered: z.string().transform((val) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  ),
  skillsWanted: z.string().transform((val) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  ),
  isPublic: z.enum(["true", "false"]),
  availability: z.object({
    weekends: z.boolean(),
    weekdaysDaytime: z.boolean(),
    weekdaysEvenings: z.boolean(),
  }),
  avatar: z.any().optional(), // file
});

const Profile = () => {
  const { token, backendUrl, userData } = useContext(AppContext);

  const [userDetail, setUserDetail] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
      bio: "",
      skillsOffered: "",
      skillsWanted: "",
      isPublic: "true",
      availability: {
        weekends: false,
        weekdaysDaytime: false,
        weekdaysEvenings: false,
      },
    },
  });

  // Fetch user profile
  const getProfileData = async () => {
    try {
      const res = await axios.get(backendUrl + "/users/me", {
        headers: { token },
      });
      const user = res.data.userData;
      setUserDetail(user);

      if (res.Success) {
        toast.success("Profile Updated :)", {
          position: "top-right",
        });
      }
      
      // ✅ Reset form with backend data
      reset({
        ...user,
        skillsOffered: user.skillsOffered?.join(", ") || "",
        skillsWanted: user.skillsWanted?.join(", ") || "",
        isPublic: user.isPublic ? "true" : "false",
        availability: {
          weekends: user.availability?.weekends || false,
          weekdaysDaytime: user.availability?.weekdaysDaytime || false,
          weekdaysEvenings: user.availability?.weekdaysEvenings || false,
        },
      });
      
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Profile Updated :)", {
        position: "top-right",
      });
    }
  };
  
  useEffect(() => {
    getProfileData();
  }, [backendUrl, userData, token]);
  
  // Handle avatar upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("avatar", file); // set in RHF
    }
  };
  
  // Submit form
  const onSubmit = async (values) => {
    try {
      const data = new FormData();
      
      // Append simple fields
      data.append("name", values.name);
      data.append("email", values.email);
      data.append("location", values.location || "");
      data.append("bio", values.bio || "");
      data.append("isPublic", values.isPublic);
      
      // Arrays
      values.skillsOffered.forEach((s) => data.append("skillsOffered", s));
      values.skillsWanted.forEach((s) => data.append("skillsWanted", s));
      
      // Availability
      Object.entries(values.availability).forEach(([k, v]) => {
        data.append(`availability[${k}]`, v);
      });
      
      // File
      if (values.avatar) data.append("avtar", values.avatar);
      
      console.log("Final FormData:");
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }
      
      const res = await axios.post(backendUrl + "/users/update-profile", data, {
        headers: { token },
      });
      
        toast.success("Profile Updated :)", {
          position: "top-right",
        });
        
        alert(res.data.message);
        setUserDetail(res.data.userData);
        getProfileData();
      } catch (err) {
        console.error(err.response?.data || err.message);
        toast.error(err.message, {
          position: "top-right",
        });
    }
  };

  if (!userDetail) return <p className="text-center mt-5">Loading...</p>;
  console.log(userDetail);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <h3>
        <span className="text-white bg-red-600">
          {userDetail.banned ? (
            <p className="text-white bg-red-600 text-center rounded-full my-2">
              You are banned by admin :(
            </p>
          ) : (
            ""
          )}
        </span>
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-2xl shadow-md space-y-4"
      >
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <img
            src={previewImage || userDetail.avatarUrl}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700">Name</label>
          <input {...register("name")} className="w-full border p-2 rounded" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            {...register("email")}
            disabled
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700">Location</label>
          <input
            {...register("location")}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-gray-700">Bio</label>
          <textarea
            {...register("bio")}
            className="w-full border p-2 rounded"
            rows="3"
          />
        </div>

        {/* Skills Offered */}
        <div>
          <label className="block text-gray-700">Skills Offered</label>
          <input
            {...register("skillsOffered")}
            className="w-full border p-2 rounded"
          />
          <small className="text-gray-500">Comma separated</small>
        </div>

        {/* Skills Wanted */}
        <div>
          <label className="block text-gray-700">Skills Wanted</label>
          <input
            {...register("skillsWanted")}
            className="w-full border p-2 rounded"
          />
          <small className="text-gray-500">Comma separated</small>
        </div>

        {/* isPublic */}
        <div>
          <label className="block text-gray-700">isPublic</label>
          <select
            {...register("isPublic")}
            className="w-full border p-2 rounded"
          >
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-gray-700">Availability</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("availability.weekends")} />
              Weekends
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("availability.weekdaysDaytime")}
              />
              Weekdays (Daytime)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("availability.weekdaysEvenings")}
              />
              Weekdays (Evenings)
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={userDetail.banned}
          className={`w-full py-2 rounded 
    ${
      userDetail.banned
        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
        >
          {userDetail.banned
            ? "Account Suspended"
            : isSubmitting
            ? "Submitting...."
            : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
