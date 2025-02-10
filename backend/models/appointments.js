const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/hospital_db');

const appointSchema = new mongoose.Schema({
    AppointmentID: {
        type: Number,
        required: true,
        unique: true
    },

    Date:{
        type:Date,
        required:true
    },

    Time:{
        type: String,
        required:true
    },

    patientId:{
        type: mongoose.Schema.Types.Number,
        ref:'Patient',
        required: true
    },

    DoctorID:{
        type:mongoose.Schema.Types.Number,
        ref:'Doctor',
        required:true
    }
},
{
    timestamps: true,
    collection:"Appointments"
}
);

const Appointment = mongoose.model("Appointments", appointSchema);

module.exports = Appointment;
