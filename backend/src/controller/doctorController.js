const doctorService = require('../services/doctorService');

exports.getProfileInfo = async(req,res) =>{
  console.log("gettingProfileInfo in controller for doctor");
try {
    const result = await doctorService.fetchProfile(req.query.id);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
}
};

exports.editProfile = async(req,res) =>{
  console.log("updating profile");
try {
    const result = await doctorService.updateProfile(req,res);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to update profile infos"})
}
};

exports.getPatient = async(req,res) =>{
  console.log("gettingPatient in controller for doctor");
try {
    const result = await doctorService.fetchPatient(req.query.id);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
}
};

exports.getPatientInfo = async(req,res) =>{
  console.log("gettingPatientInfo in controller for doctor");
try {
    const result = await doctorService.fetchPatientInfo(req.query.docID,req.query.appID);
    res.status(200).json(result);
} catch (error) {
  res.status(500).json({error : "Failed to fetch profile infos"})
}
};

exports.createConsultation = async (req, res) => {
  try {
    const payload = req.body;

    const result = await doctorService.createConsultationService(payload);

    res.status(200).json({
      message: "Consultation saved successfully",
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to save consultation"
    });
  }
};