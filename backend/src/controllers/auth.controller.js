import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/jwt.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be atleast 6 characters long" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);


        const newUser = await User.create({
            fullName,
            email,
            password: hashPassword
        });
        generateToken(newUser, res);
        res.status(201).json(newUser);
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
        console.error("error in singup: ", err.message);
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json(400).json({ error: "All fields required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user, res);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
        console.error("error in login: ", err.message);
    }

}

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("error in logout: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user.id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic must required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error in update profile: ", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}