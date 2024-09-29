import { Store } from "../models/storeModel.js"; // Adjust the import path based on your directory structure
import { User } from "../models/userModel.js";
// Create a new store
export const createStore = async (req, res) => {
  try {
    const store = await new Store(
      // name: req.body.name,
      // address: req.body.address,
      // owner_id: req.body.owner_id, // Reference to the owner's User ID
      // contact_number: req.body.contact_number,
      // workers: req.body.workers || [],
      // services_offered: req.body.services_offered || [],
      // ratings: {
      //   average_rating: req.body.ratings?.average_rating || 0,
      //   total_reviews: req.body.ratings?.total_reviews || 0,
      // },
      // opening_hours: req.body.opening_hours,
      // created_at: new Date(),
      // updated_at: new Date(),
      req.body
  
    ).save();
// const user = await User.findById(req.user.id);
// user.store.push(store._id);
// await user.save()
    
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read store details
export const getStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update store details
export const updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        address: req.body.address,
        owner_id: req.body.owner_id,
        contact_number: req.body.contact_number,
        workers: req.body.workers,
        services_offered: req.body.services_offered,
        ratings: {
          average_rating: req.body.ratings?.average_rating || 0,
          total_reviews: req.body.ratings?.total_reviews || 0,
        },
        opening_hours: req.body.opening_hours,
        updated_at: new Date(),
      },
      { new: true }
    );

    if (!store) return res.status(404).json({ message: "Store not found" });

    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a store
export const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    res.status(204).json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all salons (optional)
export const getAllStores = async (req, res) => {
  try {
    const store = await Store.find();
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
