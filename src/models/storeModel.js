import mongoose from "mongoose";

// schema for the store
const storeModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  owner_id: mongoose.Schema.Types.ObjectId,
  contact_number: {
    type: String,
    required: true,
  },
  workers: [mongoose.Schema.Types.ObjectId], // Array of Worker IDs
  services_offered: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  ], // Array of Service IDs
  ratings: {
    average_rating: Number,
    total_reviews: Number,
  },
  opening_hours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    // Add other days as needed
  },
  created_at: Date,
  updated_at: Date,
});

// schema for the salon workers
const workerModel = new mongoose.Schema({
  name: {
    type: String,
  },
  salon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
  }, // Reference to the Salon the worker belongs to
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  ], // Array of Service IDs
  availability: {
    type: String,
  },
  created_at: Date,
  updated_at: Date,
});

// Schema for service provided by the salons
const serviceModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: String,
      required: true,
    }, // Price of the service
    duration: {
      type: String,
      required: true,
    }, // Duration in minutes
  },
  { timestamps: true }
);

// Review Schema
const reviewModel = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: mongoose.Schema.Types.ObjectId, // Reference to the User leaving the review
  worker_id: mongoose.Schema.Types.ObjectId, // Reference to the Worker being reviewed
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: String, // Optional comment left by the user
  created_at: Date,
});

export const Worker = mongoose.model("Worker", workerModel);
export const Service = mongoose.model("Service", serviceModel);
export const Review = mongoose.model("Review", reviewModel);
export const Store = mongoose.model("Store", storeModel);
