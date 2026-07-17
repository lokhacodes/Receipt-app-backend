import { Router } from "express";

import authRoutes from "./auth.routes";
import receiptRoutes from "./receipt.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/receipts",receiptRoutes);

export default router;