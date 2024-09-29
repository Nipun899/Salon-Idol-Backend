import { Appointment } from "../models/appointmentModel.js"; // Adjust the import path based on your directory structure
import { Service } from "../models/storeModel.js";
import { Worker } from "../models/storeModel.js";
import mongoose from "mongoose";
// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const service = await Service.findById(req.body.service_id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const newAppointment = new Appointment({
      ...req.body,
      price: service.price,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedAppointment = await newAppointment.save();
    const populatedAppointment = await Appointment.findById(
      savedAppointment._id
    )
      .populate({
        path: "user_id",
        select: "name -_id",
      })
      .populate("salon_id")
      .populate("worker_id")
      .populate("service_id");

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read appointment details
export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment details
export const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        user_id: req.body.user_id,
        salon_id: req.body.salon_id,
        worker_id: req.body.worker_id,
        service_id: req.body.service_id,
        appointment_time: req.body.appointment_time,
        status: req.body.status,
        payment_status: req.body.payment_status,
        price: req.body.price,
        updated_at: new Date(),
      },
      { new: true }
    );

    if (!updatedAppointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAppointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.status(204).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all appointments (optional)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "user_id",
        select: "name phone -_id",
      })
      .populate({
        path: "service_id",
        select: "name duration -_id",
      })
      .populate({
        path: "worker_id",
        select: "name -_id",
      });;
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookedAppointments = async (req, res) => {
  try {
    const bookedAppointments = await Appointment.find({ status: "booked" })
      .populate({
        path: "user_id",
        select: "name  phone -_id",
      })
      .populate({
        path: "salon_id",
        select: "name -_id",
      })
      .populate({
        path: "worker_id",
        select: "name -_id",
      })
      .populate({
        path: "service_id",
        select: "name duration -_id",
      });
    return res.status(200).json({
      success: true,
      message: "found all booked appointments",
      data: bookedAppointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getPendingAppointments = async (req, res) => {
  try {
    const bookedAppointments = await Appointment.find({
      status: "pending",
    })
      .populate({
        path: "user_id",
        select: "name  phone -_id",
      })
      .populate({
        path: "salon_id",
        select: "name -_id",
      })
      .populate({
        path: "worker_id",
        select: "name -_id",
      })
      .populate({
        path: "service_id",
        select: "name duration -_id",
      });
    return res.status(200).json({
      success: true,
      message: "found all booked appointments",
      data: bookedAppointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updatePendingAppointments = async (req, res) => {
  const appointmentId = req.params.id;
  const { worker_id } = req.body;

  try {
    // First, find the appointment to check its status
    const appointment = await Appointment.findById(appointmentId);

    // If appointment is not found
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // If the appointment is already booked, return an error
    if (appointment.status === "booked") {
      return res.status(400).json({ message: "Appointment is already booked" });
    }

    // Proceed to update the appointment status and worker_id
    const updatedPendingAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: "booked",
        worker_id: worker_id,
      },
      { new: true }
    ).populate({
      path: "worker_id",
      select: "name -_id",
    });

    // Return the updated appointment with the worker's name
    return res.status(200).json({
      message:
        "Appointment Booked Successfully to " +
        updatedPendingAppointment.worker_id.name,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const checkedInAppointments = async (req, res) => {
  const appointmentId = req.params.id;

  // Validate if the appointmentId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID format",
    });
  }

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.status === "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Appointment is already checked in" });
    }

    const updatedCheckedInAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: "completed",
      },
      { new: true } // Ensure it returns the updated document
    ).populate({
      path: "user_id",
      select: "name -_id",
    });

    return res.status(200).json({
      success: true,
      message: "Appointment checked in successfully",
      checkedInAppointment: updatedCheckedInAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCompletedAppointments = async (req, res) => {
  try {
    const bookedAppointments = await Appointment.find({
      status: "completed",
    })
      .populate({
        path: "user_id",
        select: "name  phone -_id",
      })
      .populate({
        path: "salon_id",
        select: "name -_id",
      })
      .populate({
        path: "worker_id",
        select: "name -_id",
      })
      .populate({
        path: "service_id",
        select: "name duration -_id",
      });
    return res.status(200).json({
      success: true,
      message: "found all completed appointments",
      data: bookedAppointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCancelAppointments = async (req, res) => {
  const appointmentId = req.params.id;
  const { worker_id } = req.body;

  try {
    // First, find the appointment to check its status
    const appointment = await Appointment.findById(appointmentId);

    // If appointment is not found
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    // If the appointment is already completed it cannot be cancelled, return the error
    if (appointment.status === "completed") {
      return res.status(400).json({
        message:
          "Appointment is already completed hence it cannot be cancelled",
      });
    }

    // If the appointment is already booked, return an error
    if (appointment.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Appointment is already cancelled" });
    }

    // Proceed to update the appointment status and worker_id
    const updatedCancelledAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: "cancelled",
        worker_id: worker_id,
      },
      { new: true }
    ).populate({
      path: "worker_id",
      select: "name -_id",
    });

    // Return the updated appointment with the worker's name
    return res.status(200).json({
      message: "Appointment Cancelled",
      data: updatedCancelledAppointment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatedPaidAppointments = async (req, res) => {
  const appointmentId = req.params.id;

  // Validate if the appointmentId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID format",
    });
  }

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.status === "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Appointment is already paid" });
    }

    const updatedCheckedInAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: "paid",
      },
      { new: true } // Ensure it returns the updated document
    ).populate({
      path: "user_id",
      select: "name -_id",
    });

    return res.status(200).json({
      success: true,
      message: "Paid Successfully",
      checkedInAppointment: updatedCheckedInAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPaidAppointments = async (req,res)=>{
  try {
    const bookedAppointments = await Appointment.find({
      status: "completed",
    })
      .populate({
        path: "user_id",
        select: "name  phone -_id",
      })
      .populate({
        path: "salon_id",
        select: "name -_id",
      })
      .populate({
        path: "worker_id",
        select: "name -_id",
      })
      .populate({
        path: "service_id",
        select: "name duration -_id",
      });
    return res.status(200).json({
      success: true,
      message: "found all completed appointments",
      data: bookedAppointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}