const express = require("express");
const {
  sendAppointmentBookedNotification,
  sendConsultationCompletedNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/appointment-booked", sendAppointmentBookedNotification);
router.post("/consultation-completed", sendConsultationCompletedNotification);

module.exports = router;
