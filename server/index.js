import fs from "fs";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import placesRoutes from "./routes/places.js";
import usersRoutes from "./routes/users.js";
import mongoose from "mongoose";
import { createError } from "./utils/Error.js";

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use(express.static(path.join(__dirname, 'client/build'), { 
  etag: false,
  cacheControl: false,
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw createError(404, "Oooppps you're going the wrong way... head back ?");
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (error) => {
      console.log(error);
    });
  }
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || "Unknown Error Occurred" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWORD}@clustervisi.nsagkj8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("CONNECTED TO DB");
    });
  })
  .catch((error) => {
    console.log(error);
  });
