const jwt = require("jsonwebtoken");
const usermodel = require("../model/Auth.model");

async function protectedRoute(req, res, next) {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "unauthorized no token found" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await usermodel.findById(decode.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "unauthorized user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized invalid token" });
  }
}


module.exports = protectedRoute;