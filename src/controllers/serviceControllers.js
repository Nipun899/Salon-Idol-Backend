import { Service } from "../models/storeModel.js"; // Adjust the import path based on your directory structure
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Create a new service
export const createService = async (req, res) => {
  try {
    const newService = await new Service({
      ...req.body,
      image: req.file.path,
    }).save();

    res.status(201).json({
      success: true,
      message: "service created",
      service: newService,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read service details
export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update service details
export const updateService = async (req, res) => {
  const { name, price, duration, updated_at } = req.body;
  const id = req.params.id;

  try {
    const service = await Service.findById(id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
    // If the user has an existing profile image, delete it
    if (service.image) {
      const oldImagePath = path.join(__dirname, "../../", service.image);
      // Check if the old image exists and delete it
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
      }
    }

    service.image = path.join("uploads", req.file.filename);

    // Update other fields only if they exist in the request
    service.name = name !== undefined ? name : service.name;
    service.price = price !== undefined ? price : service.price;
    service.duration = duration !== undefined ? duration : service.duration;

    service.updated_at = new Date(); // Set the updated timestamp

    await service.save(); // Save the updated user to the database

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedService: service,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService)
      return res.status(404).json({ message: "Service not found" });

    res.status(204).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all services (optional)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
