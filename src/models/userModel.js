import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: String,
  address: {
    type: String,
  },
  profile_image: String,
  past_bookings: [
    {
      appointment_id: mongoose.Schema.Types.ObjectId,
      status: String,
    },
  ],
  payment_methods: [
    {
      card_type: String,
      last_4_digits: String,
      expiry_date: String,
    },
  ],
  store:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Store"
    }
  ],
  created_at: Date,
  updated_at: Date,
});

export const User = mongoose.model("User", userModel);
