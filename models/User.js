const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

            fullname: { type: "string" },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
                      gender: {  enum: ["male","female"],type: "string" },
            age: { type: "number" },
            fulladdress: { type: "string" },
            phone: { type: "number" },
            weight: { type: "number" } , // in kg

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User_regs", UserSchema);