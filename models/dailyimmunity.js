const mongoose = require("mongoose");

const dailyImmunitySchema = new mongoose.Schema({

 phone: { type: "number" ,required: true },
 physicalEnergy: {
    type: Number,
    enum: [10, 6, 3] // good, poor, very poor
  },

  appetite: {
    type: Number,
    enum: [10, 6, 3]
  },

  digestionComfort: {
    type: Number,
    enum: [10, 6, 3]
  },

  burningPain: {
    type: Number,
    enum: [10, 6, 3] // none, poor, severe
  },

  bloatingGas: {
    type: Number,
    enum: [10, 6, 3]
  },

  bloodPressure: {
    type: Number,
    enum: [10, 6, 3] // normal, low/high
  },

  swelling: {
    type: Number,
    enum: [10, 6, 3]
  },

  fever: {
    type: Number,
    enum: [10, 6, 3]
  },

  infection: {
    type: Number,
    enum: [10, 6, 3]
  },

  breathingProblem: {
    type: Number,
    enum: [10, 6, 3]
  },

  menstrualRegularity: {
    type: Number,
    enum: [10, 6, 3]
  },

  libidoStability: {
    type: Number,
    enum: [10, 6, 3]
  },

  hairHealth: {
    type: Number,
    enum: [10, 6, 3]
  },

  sleepHours: {
    type: Number
  },

  immunityScore: {
    type: Number,
    min: 0,
    max: 10
  },




  immunityLevel: {
    type: String,
    enum: ["low", "medium", "good"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("dailyimmunity", dailyImmunitySchema);