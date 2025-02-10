const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/hospital_db');

const MedicalProcedure = new mongoose.Schema({
    ProcedureID: {
        type: Number,
        required: true,
        unique: true
    },

    ProcedureName:{
        type:String,
        required:true
    },

    AppointmentID:{
        type: Number,
        required:true
    }
},
{
    timestamps: true,
    collection:"MedicalProcedure"
}
);

const Appointment = mongoose.model("MedicalProcedure", MedicalProcedure);

module.exports = Appointment;
