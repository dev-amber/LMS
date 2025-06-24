
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course', // <-- must match your Course model name
    },
  ],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema); // ✅ important

export default User;
