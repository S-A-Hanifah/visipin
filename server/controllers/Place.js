import { uuid } from "uuidv4";
import fs from "fs";
import { validationResult } from "express-validator";
import { createError } from "../utils/Error.js";
import { getCoordinates } from "../utils/Geo.js";
import Place from "../models/Place.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const getPlaceById = async (req, res, next) => {
  const { placeId } = req.params;

  let places;
  try {
    places = await Place.findById(placeId);
  } catch (error) {
    return next(
      createError(
        500,
        "Something Went Wrong, Couldn't find what you're looking for"
      )
    );
  }

  if (!places) {
    return next(createError(404, "No place belong to the given ID"));
  }

  res.status(200).json(places.toObject({ getters: true }));
};

export const getPlacesByUserId = async (req, res, next) => {
  const { userId } = req.params;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(
      createError(
        500,
        "Something Went Wrong, Couldn't find what you're looking for"
      )
    );
  }

  if (!places || places.length === 0) {
    return next(createError(404, "No places belongs to that user ID"));
  }

  res
    .status(200)
    .json({ places: places.map((place) => place.toObject({ getters: true })) });
};

export const createPlace = async (req, res, next) => {
  const creator = req.userData.userId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(createError(422, "Invalid Input, Check Input Before Sending"));
  }

  const { title, description, address } = req.body;

  let coordinates = await getCoordinates(address);

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(
      createError(404, "Oopppss something went wrong, try again later")
    );
  }

  if (!user) {
    return next(
      createError(404, "The Id you provided, doesn't belong to anyone")
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(createError(500, "We missed your pin, try again later"));
  }

  res.status(201).json({ place: createdPlace });
};

export const editPlaces = async (req, res, next) => {
  const errors = validationResult(req);
  const { title, description } = req.body;
  const { placeId } = req.params;
  let place;

  if (!errors.isEmpty()) {
    return next(createError(422, "Invalid Input, Check Input Before Sending"));
  }

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      createError(
        500,
        "Something Went Wrong, Couldn't find what you're looking for"
      )
    );
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(createError(401, "You can only Edit Your Places"));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(
      createError(500, "Something Went Wrong, Plese Try Again Later")
    );
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

export const deletePlaces = async (req, res, next) => {
  const { placeId } = req.params;
  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(
      createError(500, "Something Went Wrong, Plese Try Again Later")
    );
  }

  if (!place) {
    return next(createError(404, "No Place goes by that Id."));
  }

  if (place.creator.id !== req.userData.userId) {
    return next(createError(401, "You can only Delete Your Places"));
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Place.deleteOne({ _id: placeId }, { session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(
      createError(500, "Something went wrong, could not delete place")
    );
  }

  fs.unlink(imagePath, (error) => {
    console.log(error);
  });

  res.status(200).json({ message: "Place has been deleted" });
};
