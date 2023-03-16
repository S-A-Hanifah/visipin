import jwt from "jsonwebtoken";
import { createError } from "../utils/Error.js";

export const auth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication Failed");
    }

    const decodedToken = jwt.verify(token, process.env.PRIV_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(createError(403, "Failed Authentication"));
  }
};
