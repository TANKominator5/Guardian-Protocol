import express from "express";
import { logEvent, getEntityTimeline } from "../controllers/eventController.js";

const router = express.Router();

router.post("/", logEvent);
router.get("/:entity_id/timeline", getEntityTimeline);

export default router;
