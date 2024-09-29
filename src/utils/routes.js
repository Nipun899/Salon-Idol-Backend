import { userRoute } from "../routes/userRoutes.js";
import storeRoutes from "../routes/storeRoutes.js";
import serviceRoute from "../routes/servicesRoutes.js";
import workerRoutes from "../routes/workerRoutes.js";
import appointmentRoutes from "../routes/appointmentRoutes.js";

const route = (app) => {
  app.use("/user", userRoute);
  app.use("/store", storeRoutes);
  app.use("/service", serviceRoute);
  app.use("/worker", workerRoutes)
  app.use("/appointment", appointmentRoutes)
};
export default route;
