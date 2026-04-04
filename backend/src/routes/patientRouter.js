const express = require('express');
const patientRouter = express.Router();

const patientController = require('../controller/patientController');
const { verifyPatient } = require('./PatientAuth');

//login
patientRouter.post('/login',patientController.loginPatient);
//signup
patientRouter.post("/signup", patientController.signup);

patientRouter.get('/profile',verifyPatient,patientController.getProfileInfo);
patientRouter.post('/update',verifyPatient,patientController.editProfile);

//get category
patientRouter.get('/specializations',verifyPatient,patientController.getSpecializations);
patientRouter.get('/doctorList',verifyPatient,patientController.getDoctorList);
patientRouter.get('/doctorSchedule',verifyPatient,patientController.getDocSchedule);
patientRouter.post('/bookAppointment',verifyPatient,patientController.AppointmentBooking);


//get-appointment
patientRouter.get('/upcoming-appointment',verifyPatient,patientController.getAppointment);
patientRouter.get('/recordlist',verifyPatient,patientController.getRecordList);
//for precriptioncard
patientRouter.get('/prescription',verifyPatient,patientController.getPrescription);

patientRouter.get('/billPending',verifyPatient,patientController.getBillPending);
patientRouter.get('/billPaid',verifyPatient,patientController.getBillPaid);


//delete appointment
patientRouter.delete("/appointments/:id", verifyPatient,patientController.deleteAppointment);



patientRouter.get('/schedule',verifyPatient,patientController.getSchedule);
patientRouter.get('/scheduleID',verifyPatient,patientController.getScheduleID);
patientRouter.post('/bookAppointment',verifyPatient,patientController.AppointmentBooking);

//get-summery
patientRouter.get('/summary',verifyPatient,patientController.getSummary);


module.exports = patientRouter; 