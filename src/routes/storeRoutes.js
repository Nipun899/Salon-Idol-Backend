import { Router } from "express";
import {
  createStore,
  deleteStore,
  getAllStores,
  getStore,
  updateStore,
} from "../controllers/storeControllers.js";
import { upload } from "../utils/multer.js";
const storeRoutes = Router();

storeRoutes.post("/createStore", createStore);
storeRoutes.get("/getStoreById/:id", getStore);
storeRoutes.get("/getAllStores", getAllStores);
storeRoutes.delete("/deleteStore/:id", deleteStore);
storeRoutes.put("/updateStore/:id", updateStore);

export default storeRoutes