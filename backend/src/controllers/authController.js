import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// helper to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // short-lived
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { refreshToken };
};

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      current_password,
      location,
      bio,
      skillsOffered,
      skillsWanted,
      availability,
      isPublic,
    } = req.body;

    const isExisting = await User.findOne({ email });

    if (isExisting) {
      return res.status(409).json({
        Success: false,
        message: "User already existing, please login",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(current_password, salt);
    console.log("hashPassword");

    let isAdmin = "user";
    if (email === "ranjanmishra0710@gmail.com") {
      isAdmin = "admin";
    }

    const newUser = new User({
      name,
      email,
      current_password: hashPassword,
      location,
      bio,
      skillsOffered,
      skillsWanted,
      availability,
      isPublic,
      role: isAdmin
    });

    const user = await newUser.save();
    const token = jwt.sign({ id: user._id, role: isAdmin }, process.env.JWT_SECRET);

    const { current_password: _, ...userData } = newUser._doc;

    return res.status(201).json({
      Success: true,
      message: "User registered successfully",
      user: userData,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ Success: false, message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({Success: false, message: "Invalid credentials, Register first" });

    const isMatch = await bcrypt.compare(password, user.current_password);
    if (!isMatch)
      return res
        .status(400)
        .json({ Success: false, message: "Invalid credentials, Register first" });

    const tokens = generateTokens(user);

    const { current_password: _, ...userData } = user._doc;

    res.json({
      Success: true,
      message: "Login successful",
      userData,
      token: tokens.refreshToken,
    });
  } catch (err) {
    res.status(500).json({Success: false, message: err.message });
  }
};

const getProfileData = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("navbar problem", userId);
    const userData = await User.findById(userId)
      .select("-current_password -role -rating") // ❌ exclude these
      .lean();

    if (!userData) return res.status(404).json({Success: false, message: "User not found" });

    return res.json({
      message: "Profile data fetched successfully",
      userData,
    });
  } catch (err) {
    res.status(500).json({ Success: false, message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("update_profile", userId);

    const imageFile = req.file;
    console.log("profile-pic: ", imageFile);

    const {
      name,
      location,
      skillsOffered,
      skillsWanted,
      availability,
      isPublic,
      bio,
    } = req.body;

    // if (skillsOffered) skillsOffered = JSON.parse(skillsOffered);
    console.log("skillsoffered: ", skillsOffered);
    // if (skillsWanted) skillsWanted = JSON.parse(skillsWanted);
    // if (availability) availability = JSON.parse(availability);

    console.log(req.body);
    await User.findByIdAndUpdate(userId, {
      name,
      location,
      skillsOffered,
      skillsWanted,
      availability,
      isPublic,
      bio,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      console.log("secure image url", imageURL);

      await User.findByIdAndUpdate(userId, { avatarUrl: imageURL });
    }

    return res.json({Success: true, message: "profile updated ohoho" });
  } catch (error) {
    return res.json({Success: false, message: err.message });
  }
};

export { getProfileData, register, login, updateProfile };
