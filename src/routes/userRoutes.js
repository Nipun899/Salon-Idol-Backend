import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  loginUser,
  updatePassword,
  updateUser,
} from "../controllers/userControllers.js";
import { upload } from "../utils/multer.js";
export const userRoute = Router();

userRoute.post("/createUser", createUser);
userRoute.get("/getAllUsers", getAllUsers);
userRoute.get("/getById/:id", getUser);
userRoute.put("/updateUser/:id", upload.single("profile_image"), updateUser);
userRoute.delete("/deleteUser/:id", deleteUser);
userRoute.put("/updatePassword/:id", updatePassword);
userRoute.post("/loginUser/:id", loginUser);
