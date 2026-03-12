import { Router } from "express";
import eventRoutes from "./eventRoutes";
import aggregationRoutes from "./aggregationRoutes";

const router = Router();

router.use("/events", eventRoutes);
router.use("/aggregations", aggregationRoutes);

export default router;
