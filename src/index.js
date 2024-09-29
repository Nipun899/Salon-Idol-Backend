import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnection from "./db/dbConnection.js";
import route from "./utils/routes.js";
const app = express();
import fileUpload from "express-fileupload";

dotenv.config();
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true, // if you're using cookies or sessions
}));

app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true })); // For form data

app.use(express.json());

const PORT = process.env.PORT;
route(app)


dbConnection();
app.listen(PORT, () => {
  console.log("server running on PORT " + PORT);
});
