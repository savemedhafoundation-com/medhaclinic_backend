const express = require("express");
const router = express.Router();

const DailyImmunity = require("../models/dailyimmunity");

// POST : Save Daily Immunity Check
router.post("/daily-immunity-check", async (req, res) => {

  try {

    const immunityData = new DailyImmunity({

      phone: req.body.phone,
      physicalEnergy: req.body.physicalEnergy,
      appetite: req.body.appetite,
      digestionComfort: req.body.digestionComfort,
      burningPain: req.body.burningPain,
      bloatingGas: req.body.bloatingGas,
      bloodPressure: req.body.bloodPressure,
      swelling: req.body.swelling,
      fever: req.body.fever,
      infection: req.body.infection,
      breathingProblem: req.body.breathingProblem,
      menstrualRegularity: req.body.menstrualRegularity,
      libidoStability: req.body.libidoStability,
      hairHealth: req.body.hairHealth,
      sleepHours: req.body.sleepHours,
      immunityScore: req.body.immunityScore,
      immunityLevel: req.body.immunityLevel

    });

    const savedData = await immunityData.save();

    res.status(201).json({
      message: "Daily immunity check saved successfully",
      data: savedData
    });

  } catch (error) {

    res.status(500).json({
      message: "Error saving immunity data",
      error: error.message
    });

  }

});

router.post("/weekly-report", async (req, res) => {

  try {

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required"
      });
    }

    const reports = await DailyImmunity.find({ phone })
      .sort({ createdAt: -1 })
      .limit(2);

    if (!reports.length) {
      return res.json({ message: "No data found" });
    }


    /* -------- Average Function -------- */

    const avg = (arr) => {
      const valid = arr.filter(v => v !== undefined && v !== null);
      const sum = valid.reduce((a,b)=>a+b,0);
      return Number((sum / valid.length).toFixed(1));
    };


    /* -------- Score Calculation -------- */

    const calcScores = (data) => {

      return {

        energyLevels: avg([
          data.physicalEnergy,
          data.burningPain,
          data.sleepHours
        ]),

        digestiveHealth: avg([
          data.appetite,
          data.digestionComfort,
          data.bloatingGas
        ]),

        cardiovascular: avg([
          data.bloodPressure
        ]),

        immuneResponse: avg([
          data.swelling,
          data.fever,
          data.infection
        ]),

        respiratory: avg([
          data.breathingProblem
        ]),

        hormonalHealth: avg([
          data.menstrualRegularity,
          data.libidoStability,
          data.hairHealth,
          data.sleepHours
        ])
      };

    };


    /* -------- Current Scores -------- */

    const currentScores = calcScores(reports[0]);


    /* -------- Previous Scores -------- */

    let previousScores = null;
    let scoreDifference = null;

    if (reports.length > 1) {

      previousScores = calcScores(reports[1]);


      /* -------- Difference Calculation -------- */

      const diff = (current, previous) => {
        if (!previous) return 0;
        return Number((current - previous).toFixed(1));
      };


      scoreDifference = {

        energyLevels: diff(currentScores.energyLevels, previousScores.energyLevels),

        digestiveHealth: diff(currentScores.digestiveHealth, previousScores.digestiveHealth),

        cardiovascular: diff(currentScores.cardiovascular, previousScores.cardiovascular),

        immuneResponse: diff(currentScores.immuneResponse, previousScores.immuneResponse),

        respiratory: diff(currentScores.respiratory, previousScores.respiratory),

        hormonalHealth: diff(currentScores.hormonalHealth, previousScores.hormonalHealth)

      };

    }


    /* -------- Final Response -------- */

    res.json({

      currentScores,
      previousScores,
      scoreDifference

    });

  } catch (error) {

    res.status(500).json({
      message: "Error generating weekly report",
      error: error.message
    });                   

  }

});
module.exports = router;