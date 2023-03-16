import express from "express";
import { getUser, login, signup } from "../controllers/User.js";
import { check } from "express-validator";
import { fileUpload } from "../middleware/file-upload.js";

const router = express.Router();

router.get("/", getUser);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  signup
);

router.post("/login", login);

export default router;
