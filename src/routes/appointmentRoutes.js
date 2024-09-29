import { Router } from "express";
import {
  checkedInAppointments,
  createAppointment,
  getAllAppointments,
  getAllPaidAppointments,
  getBookedAppointments,
  getCompletedAppointments,
  getPendingAppointments,
  updateCancelAppointments,
  updatedPaidAppointments,
  updatePendingAppointments,
} from "../controllers/appointmentControllers.js";
const appointmentRoutes = Router();
appointmentRoutes.post("/createAppointment", createAppointment);
appointmentRoutes.get("/getAllAppointments", getAllAppointments);
appointmentRoutes.get("/getBookedAppointments", getBookedAppointments);
appointmentRoutes.get("/getPendingAppointments", getPendingAppointments);
appointmentRoutes.put(
  "/updatePendingAppointments/:id",
  updatePendingAppointments
);
appointmentRoutes.put("/checkInAppointment/:id", checkedInAppointments);
appointmentRoutes.get("/getCompletedAppointments", getCompletedAppointments);
appointmentRoutes.put("/cancelAppointment/:id", updateCancelAppointments);
appointmentRoutes.put("/payAppointment/:id", updatedPaidAppointments);
appointmentRoutes.get("/getAllPaidAppointments", getAllPaidAppointments);
export default appointmentRoutes;
