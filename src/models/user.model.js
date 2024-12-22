import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  addServices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
  bookedServices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookedService",
    },
  ],
  todoServices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookedService",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
