const User = require("../models/User");

exports.createUser = async (req, res) => {

  try {

    const { name, email, age, city } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const user = new User({
      name,
      email,
      age,
      city
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: "User stored successfully",
      data: savedUser
    });

  } catch (error) {

    res.status(500).json({
      message: "Error storing user",
      error: error.message
    });

  }

};