const express = require("express");
const Log = require("../models/Log");
const { detectAnomaly } = require("../services/anomalyDetector");
const generateLogs = require("../utils/generateLogs");
const { explainAnomaly } = require("../services/aiService");
const router = express.Router();


//! GET all logs
// router.get("/", async (req, res) => {
//   try {
//     const logs = await Log.find().sort({ timestamp: -1 });

//     res.json({
//       count: logs.length,
//       logs,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch logs",
//     });
//   }
// });


//!changes for paging in log limit - expalined in explain

router.get("/",async(req,res)=>{
  try{

    const page =parseInt(req.query.page) || 1 ;
    const limit = parseInt(req.query.limit) || 10 ;

    const skip =(page-1)* limit;

    const logs= await Log.find()
       .sort({timestamp: -1})
       .skip(skip)
       .limit(limit);
 
    
    const total =await Log.countDocuments();

    const anomalies = await Log.countDocuments({
       isAnomaly: true,
    });

    const critical = await Log.countDocuments({
       severity: "CRITICAL",
    });

    const normal = total - anomalies;
    
    res.json({
     count: logs.length,
     total,
     anomalies,
     normal,
     critical,
     page,
     limit,
     totalPages: Math.ceil(total / limit),
     logs,
    });

  }catch{

    res.status(500).json({
      message:"failed to fetch logs",
    });
    }

});



// temporary route for datset generation
router.post("/generate", async (req, res) => {
  try {
    const logs = generateLogs(100);

    const analyzedLogs = logs.map((log) => {
      const result = detectAnomaly(log);

      return {
        ...log,
        isAnomaly: result.isAnomaly,
        anomalyScore: result.score,
        anomalyReason: result.reason,
      };
    });

    const savedLogs = await Log.insertMany(analyzedLogs);

    res.status(201).json({
      message: "Synthetic dataset generated",
      total: savedLogs.length,
      anomalies: savedLogs.filter((log) => log.isAnomaly).length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate dataset",
    });
  }
});



//routes/logRoutes.js have POST /for data log route 
router.post("/bulk", async (req, res) => {
  try {
    const logs = req.body.logs;

    if (!Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({
        message: "Logs array is required and cannot be empty",
      });
    }

    const analyzedLogs = logs.map((log) => {
      const result = detectAnomaly(log);

      return {
        ...log,
        isAnomaly: result.isAnomaly,
        anomalyScore: result.score,
        anomalyReason: result.reason,
      };
    });

    const savedLogs = await Log.insertMany(analyzedLogs);

    res.status(201).json({
      message: "Logs inserted successfully",
      total: savedLogs.length,
      anomalies: savedLogs.filter((log) => log.isAnomaly).length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to insert logs",
    });
  }
});


// GET single log
router.get("/:id", async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);

    if (!log) {
      return res.status(404).json({
        message: "Log not found",
      });
    }

    res.json(log);
  } catch (error) {
    res.status(400).json({
      message: "Invalid log ID",
    });
  }
});


// ai route intergation 
router.post("/:id/explain", async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);

    if (!log) {
      return res.status(404).json({
        message: "Log not found",
      });
    }

    // AI should only explain flagged logs
    if (!log.isAnomaly) {
      return res.status(400).json({
        message: "This log is not flagged as an anomaly",
      });
    }

    const aiResult = await explainAnomaly(log);

    log.aiExplanation = aiResult.explanation;
    log.rootCause = aiResult.rootCause;
    log.nextStep = aiResult.nextStep;

    await log.save();

    res.json({
      message: "AI analysis generated successfully",
      analysis: {
        explanation: log.aiExplanation,
        rootCause: log.rootCause,
        nextStep: log.nextStep,
      },
    });
  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      message: "Failed to generate AI analysis",
      error: error.message,
    });
  }
});


// POST a log
router.post("/", async (req, res) => {
  try {
    const {
      timestamp,
      source,
      eventType,
      severity,
      status,
      message,
    } = req.body;

    // Basic validation
    if (
      !timestamp ||
      !source ||
      !eventType ||
      !severity ||
      status === undefined ||
      !message
    ) {
      return res.status(400).json({
        message: "Missing required log fields",
      });
    }

    if (isNaN(Date.parse(timestamp))) {
      return res.status(400).json({
        message: "Invalid timestamp",
      });
    }

    const logData = {
      timestamp,
      source,
      eventType,
      severity,
      status,
      message,
    };

    // Our own anomaly detection
    const result = detectAnomaly(logData);

    const log = await Log.create({
      ...logData,
      isAnomaly: result.isAnomaly,
      anomalyScore: result.score,
      anomalyReason: result.reason,
    });

    res.status(201).json(log);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create log",
    });
  }
});


// DELETE log
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Log.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Log not found",
      });
    }

    res.json({
      message: "Log deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid log ID",
    });
  }
});


module.exports = router;