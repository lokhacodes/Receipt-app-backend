import { Router } from "express";

import authRoutes from "./auth.routes";
import receiptRoutes from "./receipt.routes";
import expenseRoutes from "./expense.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/receipts",receiptRoutes);
router.use("/expenses", expenseRoutes);

export default router;