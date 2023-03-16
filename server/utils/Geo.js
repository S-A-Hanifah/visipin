import NodeGeocoder from "node-geocoder";
import { createError } from "./Error.js";

const options = {
  provider: "openstreetmap",
};

const geocoder = NodeGeocoder(options);

export const getCoordinates = async (location) => {
  const coordinates = await geocoder
    .geocode(location)
    .then((res) => {
      const coordinates = {
        lat: res[0].latitude,
        long: res[0].longitude,
      };
      return coordinates;
    })
    .catch((err) => {
      createError(404, err);
    });
  return { ...coordinates };
};
