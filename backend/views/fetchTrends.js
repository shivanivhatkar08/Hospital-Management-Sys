require('dotenv').config();
const connectDB = require('../config/db'); // Import the database connection function
const MedicalProcedure = require('../models/medicalprocedure');

const fetchTrends = async () => {
    try {
      await connectDB();
  
      const trends = await MedicalProcedure.aggregate([
        {
          $lookup: {
            from: "Appointments",
            localField: "AppointmentID",
            foreignField: "AppointmentID",
            as: "appointmentDetails",
          },
        },
        {
            $unwind: "$appointmentDetails", // Unwind the appointmentDetails array
        },
        {
          $group: {
            _id: { ProcedureName: "$ProcedureName", month: { $month: "$appointmentDetails.Date" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.month": 1 } },
      ]);
  
      return trends;
    } catch (err) {
      console.error("Error fetching trends:", err); // Log the error on the server side
      throw new Error("Error fetching trends: " + err.message); // Throw error to be handled in the route
    }
  };
  
  module.exports = fetchTrends;