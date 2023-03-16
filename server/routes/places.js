import express from "express";
import {
  createPlace,
  deletePlaces,
  editPlaces,
  getPlaceById,
  getPlacesByUserId,
} from "../controllers/Place.js";
import { check } from "express-validator";
import { fileUpload } from "../middleware/file-upload.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:placeId", getPlaceById);

router.get("/user/:userId", getPlacesByUserId);

router.use(auth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router.patch(
  "/:placeId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  editPlaces
);

router.delete("/:placeId", deletePlaces);

export default router;
