import { Router } from "express";

import authRoutes from "./auth.routes";
import receiptRoutes from "./receipt.routes";
import expenseRoutes from "./expense.routes";
import reportRoutes from "./report.routes";


const router = Router();

router.use("/auth", authRoutes);
router.use("/receipts",receiptRoutes);
router.use("/expenses", expenseRoutes);
router.use("/reports", reportRoutes);
export default router;