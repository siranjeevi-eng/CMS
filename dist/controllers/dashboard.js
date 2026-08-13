"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
module.exports.dashBoard = async (req, res, next) => {
    //const doctors = await Doctor.find().sort({ specialization: 1, name: 1 });
    try {
        const totalDoctors = await Doctor.countDocuments();
        const totalPatients = await Patient.countDocuments();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const startOfNextMonth = new Date(startOfMonth);
        startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
        const patientsAddedThisMonth = await Patient.countDocuments({
            createdAt: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }
        });
        const patientsAddedToday = await Patient.countDocuments({
            createdAt: {
                $gte: startOfToday,
                $lt: startOfTomorrow
            }
        });
        const underTreatmentPatients = await Patient.countDocuments({
            "medicalRecord.status": "under_treatment"
        });
        const recoveredPatients = await Patient.countDocuments({
            "medicalRecord.status": "recovered"
        });
        const dischargedPatients = await Patient.countDocuments({
            "medicalRecord.status": "discharged"
        });
        res.status(200).json({
            totalDoctors,
            totalPatients,
            patientsAddedToday,
            patientsAddedThisMonth,
            underTreatmentPatients,
            recoveredPatients,
            dischargedPatients
        });
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=dashboard.js.map