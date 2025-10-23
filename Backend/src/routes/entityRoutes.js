import express from "express";
import { getEntityById, searchEntities, updateEntityStatus } from "../controllers/entityController.js";
const router = express.Router();

router.get("/:id", getEntityById);
router.get("/", searchEntities);
router.put("/:id/status", updateEntityStatus);

export default router;
