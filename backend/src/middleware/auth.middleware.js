import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await User.findById(decode.id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        req.user = user;
        next();
    }
    catch (err) {
        console.log("Error in protectRoute")
        res.status(500).json({ message: "Internal Server error" });
    }
}