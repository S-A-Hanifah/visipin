import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  image: {
    type: String,
    default: undefined,
    required:true
  },
  places: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Place",
    },
  ],
});

export default mongoose.model("User", UserSchema);
