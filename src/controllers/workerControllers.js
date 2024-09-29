import { populate } from "dotenv";
import { Worker } from "../models/storeModel.js"; // Adjust the import path based on your directory structure

// Create a new worker
export const createWorker = async (req, res) => {
  try {
    // Create and save the worker
    const newWorker = new Worker({
      ...req.body,
    });

    const savedWorker = await newWorker.save();

    // Now populate the references (Service and Store)
    const populatedWorker = await Worker.findById(savedWorker._id)
      .populate("salon_id")
      .populate("services");

    res.status(201).json(populatedWorker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read worker details
export const getWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update worker details
export const updateWorker = async (req, res) => {
  try {
    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      {
        name: {
          first: req.body.name.first,
          last: req.body.name.last,
        },
        salon_id: req.body.salon_id,
        services: req.body.services,
        availability: req.body.availability,
        rating: {
          average_rating: req.body.rating?.average_rating || 0,
          total_reviews: req.body.rating?.total_reviews || 0,
        },
        updated_at: new Date(),
      },
      { new: true }
    );

    if (!updatedWorker)
      return res.status(404).json({ message: "Worker not found" });

    res.status(200).json(updatedWorker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a worker
export const deleteWorker = async (req, res) => {
  try {
    const deletedWorker = await Worker.findByIdAndDelete(req.params.id);
    if (!deletedWorker)
      return res.status(404).json({ message: "Worker not found" });

    res.status(204).json({ message: "Worker deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all workers (optional)
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find()
      .populate({
        path: "salon_id",
        select: "name -_id",
      })
      .populate({
        path: "services",
        select: "name duration -_id",
      });
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
