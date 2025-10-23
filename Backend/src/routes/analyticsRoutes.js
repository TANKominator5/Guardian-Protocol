import express from "express";
import { getEntityConfidenceScores, getLocationActivity, generateDailyReport } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/scores/:entity_id", getEntityConfidenceScores);
router.get("/activity", getLocationActivity);
router.get("/daily", generateDailyReport);

export default router;
