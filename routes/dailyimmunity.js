const express = require("express");
const router = express.Router();

const DailyImmunity = require("../models/dailyimmunity");

// POST : Save Daily Immunity Check
router.post("/save_daily_immunity", async (req, res) => {

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
      immunityScore: req.body.totalScore,
      immunityLevel: req.body.speedometer

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
        success: false,
        message: "Phone number is required",
      });
    }

    // Get latest 2 entries for this phone
    const reports = await DailyImmunity.find({ phone })
      .sort({ createdAt: -1 })
      .limit(2);

    if (!reports.length) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    /* -----------------------------------------
       Average Helper
    ------------------------------------------ */
    const avg = (arr) => {
      const valid = arr.filter(
        (v) => v !== undefined && v !== null && !isNaN(Number(v))
      );

      if (!valid.length) return 0;

      const sum = valid.reduce((a, b) => Number(a) + Number(b), 0);
      return Number((sum / valid.length).toFixed(1));
    };

    /* -----------------------------------------
       Normalize Score
       If higher value = better, keep as is
       If lower value = better, reverse score
       Adjust this based on your frontend scoring
    ------------------------------------------ */
    const normalize = (value) => {
      if (value === undefined || value === null || isNaN(Number(value))) return 0;
      return Number(value);
    };

    /* -----------------------------------------
       Score Calculation
    ------------------------------------------ */
    const calcScores = (data) => {
      return {
        energyLevels: avg([
          normalize(data.physicalEnergy),
          normalize(data.burningPain),
          normalize(data.sleepHours),
        ]),

        digestiveHealth: avg([
          normalize(data.appetite),
          normalize(data.digestionComfort),
          normalize(data.bloatingGas),
        ]),

        cardiovascular: avg([
          normalize(data.bloodPressure),
        ]),

        immuneResponse: avg([
          normalize(data.swelling),
          normalize(data.fever),
          normalize(data.infection),
        ]),

        respiratory: avg([
          normalize(data.breathingProblem),
        ]),

        hormonalHealth: avg([
          normalize(data.menstrualRegularity),
          normalize(data.libidoStability),
          normalize(data.hairHealth),
          normalize(data.sleepHours),
        ]),
      };
    };

    /* -----------------------------------------
       Difference + Trend Helper
    ------------------------------------------ */
    const getDifferenceObject = (current, previous) => {
      const difference = Number((current - previous).toFixed(1));

      let trend = "same";
      if (difference > 0) trend = "up";
      if (difference < 0) trend = "down";

      return {
        current,
        previous,
        difference,
        trend,
      };
    };

    /* -----------------------------------------
       Current Scores
    ------------------------------------------ */
    const currentReport = reports[0];
    const currentScores = calcScores(currentReport);

    /* -----------------------------------------
       If only one entry exists
    ------------------------------------------ */
    if (reports.length === 1) {
      return res.status(200).json({
        success: true,
        message: "Only one report found, no previous report available",
        currentReportDate: currentReport.createdAt,
        previousReportDate: null,
        currentScores,
        previousScores: null,
        scoreDifference: null,
      });
    }

    /* -----------------------------------------
       Previous Scores
    ------------------------------------------ */
    const previousReport = reports[1];
    const previousScores = calcScores(previousReport);

    /* -----------------------------------------
       Score Difference
    ------------------------------------------ */
    const scoreDifference = {
      energyLevels: getDifferenceObject(
        currentScores.energyLevels,
        previousScores.energyLevels
      ),

      digestiveHealth: getDifferenceObject(
        currentScores.digestiveHealth,
        previousScores.digestiveHealth
      ),

      cardiovascular: getDifferenceObject(
        currentScores.cardiovascular,
        previousScores.cardiovascular
      ),

      immuneResponse: getDifferenceObject(
        currentScores.immuneResponse,
        previousScores.immuneResponse
      ),

      respiratory: getDifferenceObject(
        currentScores.respiratory,
        previousScores.respiratory
      ),

      hormonalHealth: getDifferenceObject(
        currentScores.hormonalHealth,
        previousScores.hormonalHealth
      ),
    };

    /* -----------------------------------------
       Overall Health Score
    ------------------------------------------ */
    const overallCurrent = avg([
      currentScores.energyLevels,
      currentScores.digestiveHealth,
      currentScores.cardiovascular,
      currentScores.immuneResponse,
      currentScores.respiratory,
      currentScores.hormonalHealth,
    ]);

    const overallPrevious = avg([
      previousScores.energyLevels,
      previousScores.digestiveHealth,
      previousScores.cardiovascular,
      previousScores.immuneResponse,
      previousScores.respiratory,
      previousScores.hormonalHealth,
    ]);

    const overallDifference = Number(
      (overallCurrent - overallPrevious).toFixed(1)
    );

    let overallTrend = "same";
    if (overallDifference > 0) overallTrend = "up";
    if (overallDifference < 0) overallTrend = "down";

    /* -----------------------------------------
       Final Response
    ------------------------------------------ */
    return res.status(200).json({
      success: true,
      message: "Daily immunity difference fetched successfully",

      currentReportDate: currentReport.createdAt,
      previousReportDate: previousReport.createdAt,

      currentScores,
      previousScores,

      scoreDifference,

      overall: {
        current: overallCurrent,
        previous: overallPrevious,
        difference: overallDifference,
        trend: overallTrend,
      },
    });
  } catch (error) {
    console.error("Daily immunity difference error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",  
      error: error.message,
    });
  }
});
module.exports = router;