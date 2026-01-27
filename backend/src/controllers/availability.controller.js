const Availability = require("../models/Availability.model");

exports.setAvailability = async (req, res) => {
  const { day, startTime, endTime } = req.body;

  const availability = await Availability.create({
    doctor: req.user.id,
    day,
    startTime,
    endTime
  });

  res.status(201).json({
    message: "Availability added",
    availability
  });
};
