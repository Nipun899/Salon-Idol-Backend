import mongoose  from "mongoose";
const appointmentModel = new mongoose.Schema({
    user_id: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },  // Reference to the User who made the appointment
    salon_id: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Store"
    },  // Reference to the Salon
    worker_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Worker"
    },  // Reference to the Worker who will provide the service
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    },  // Reference to the Service
    appointment_time: String, 
    status: {
      type: String,
      enum: ["booked", "completed", "cancelled", "pending", "paid"],
      default: "pending"
    },
    price: Number,  // Price charged for the appointment
    created_at: Date,
    updated_at: Date
})

export const Appointment = mongoose.model("Appointment", appointmentModel)