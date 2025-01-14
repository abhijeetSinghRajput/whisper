import jwt from "jsonwebtoken";

export const generateToken = (user, res)=>{
    const payload = {id: user._id, email: user.email};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
}