require('dotenv').config();
///externel module
const cors = require('cors');
const express = require('express');

//local module
const patientRouter = require('./src/routes/patientRouter');

//middleware
const app = express();
app.use(cors());

app.use(express.json());

//routing
app.use('/api/patient',patientRouter);

const PORT = 3001;
app.listen(PORT,()=>{
  console.log("Server is running...");
})