import express from "express";
import { getEntities, getEntityById, updateEntityStatus } from "../controllers/entityController.js";

const router = express.Router();

router.get("/", getEntities);                 // ?query, ?status, ?limit, ?offset
router.get("/:id", getEntityById);            // /api/entities/:id
router.put("/:id/status", updateEntityStatus); // Update status field

export default router;
