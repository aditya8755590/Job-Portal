import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    const file = req.file;

    if (!fullName || !email || !phoneNumber || !password || !role || !file) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname: fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {}, // ✅ important (prevents future crash)
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch || role !== user.role) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userData,
        success: true,
      });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    console.log("LOGOUT ERROR:", error);
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // ✅ ensure profile exists
    if (!user.profile) {
      user.profile = {};
    }

    // ✅ convert skills
    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    // ✅ upload to cloudinary only if file exists
    // let cloudResponse;
    // if (file) {
    //   const fileUri = getDataUri(file);
    //   cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
    //     resource_type: "raw", // ✅ IMPORTANT for PDF
    //   });
    // }

    if (!user.profile) {
      user.profile = {};
    }

    let cloudResponse;

    if (file) {
      const fileUri = getDataUri(file);

      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "raw",
      });

      console.log("CLOUD RESPONSE:", cloudResponse);

      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    // ✅ update fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    // ✅ save resume
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;

      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
