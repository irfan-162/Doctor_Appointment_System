require('dotenv').config();
///externel module
const cors = require('cors');
const express = require('express');

//local module
const patientRouter = require('./src/routes/patientRouter');
const doctorRouter = require('./src/routes/doctorRouter');

//middleware
const app = express();
app.use(cors());

app.use(express.json());

//routing
app.use('/api/patient',patientRouter);
app.use('/api/doctor',doctorRouter);

const PORT = 3001;
app.listen(PORT,()=>{
  console.log("Server is running...");
})