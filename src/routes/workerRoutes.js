import { Router } from "express";
import { createWorker, getAllWorkers } from "../controllers/workerControllers.js";
const workerRoutes = Router();
workerRoutes.post("/createWorker", createWorker);
workerRoutes.get("/getAllWorkers", getAllWorkers)
export default workerRoutes;
