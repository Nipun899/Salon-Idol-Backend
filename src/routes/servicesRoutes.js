import { Router } from "express";
import {
  createService,
  getAllServices,
  getService,
  updateService
} from "../controllers/serviceControllers.js";
import { upload } from "../utils/multer.js";
const serviceRoute = Router();

serviceRoute.post("/createService", upload.single("image"), createService);
serviceRoute.get("/getAllServices", getAllServices);
serviceRoute.get("/getService", getService);
serviceRoute.put("/updateService/:id",upload.single("image"), updateService)
export default serviceRoute;
