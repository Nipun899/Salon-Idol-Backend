import mongoose from "mongoose";

function dbConnection() {
  const mongoDbConnection = process.env.MONGODBURL;
  try {
    mongoose.connect(mongoDbConnection).then(()=>{
        console.log("Connected to server");
    })
  } catch (error) {
    console.log(error);
  }
}

export default dbConnection;
