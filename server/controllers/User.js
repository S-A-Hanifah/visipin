import { createError } from "../utils/Error.js";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(
      createError(500, "Oooppss Something went wrong, Try Again later")
    );
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  const { name, email, password, image } = req.body;

  if (!errors.isEmpty()) {
    return next(createError(422, "Invalid Input, Check Input Before Sending"));
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      createError(500, "Oooopss something went wrong, Please Try again Later")
    );
  }

  if (existingUser) {
    return next(createError(422, `Welcome Back ${name}, Login To Continue`));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      createError(500, "Oooopss something went wrong, Please Join us Later")
    );
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(
      createError(500, "Oooopss something went wrong, Please Join us Later")
    );
  }

  let token;

  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.PRIV_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(
      createError(500, "Oooopss something went wrong, Please Join us Later")
    );
  }

  res.status(201).json({
    message: `Welcome ${name}`,
    user: createdUser.id,
    email: createdUser.email,
    token,
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      createError(500, "Oooopss something went wrong, Please Try again Later")
    );
  }

  if (!existingUser) {
    return next(createError(403, "Become a User, and Enjoy the perks"));
  }

  let passwordValid = false;

  try {
    passwordValid = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      createError(
        500,
        "Oooopss something went wrong, Try checking your credentials"
      )
    );
  }

  if (!passwordValid) {
    return next(
      createError(
        401,
        "Oooopss something went wrong, Try checking your credentials"
      )
    );
  }

  let token;

  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.PRIV_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(
      createError(500, "Oooopss something went wrong, Please Login Later")
    );
  }

  res.status(200).json({
    message: `Welcome Back ${existingUser.name}!`,
    user: existingUser.id,
    email: existingUser.email,
    token,
  });
};
