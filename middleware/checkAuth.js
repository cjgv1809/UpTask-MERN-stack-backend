import jwt from "jsonwebtoken";
import User from "../models/User.js";

const checkAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user from payload to request object and remove password and other fields from the response
      req.user = await User.findById(decoded.id).select(
        "-password -confirmed -token -createdAt -updatedAt -__v"
      );

      next();
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .json({ error: "Not authorized, token expired or not valid" });
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
};

export { checkAuth };
