import { Router, RequestHandler } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
  createReportHandler,
  getReportsHandler,
  getReportHandler,
  updateReportHandler,
  deleteReportHandler,
  getReportExpensesHandler,
} from "../controllers/report.controller";

const router = Router();

/* Protect all report routes */

router.use(authenticate as RequestHandler);

/* ==========================================
   REPORT ROUTES
========================================== */

router.post("/", createReportHandler);

router.get("/", getReportsHandler);

router.get("/:id", getReportHandler);

router.put("/:id", updateReportHandler);

router.delete("/:id", deleteReportHandler);

router.get(
  "/:id/expenses",
  getReportExpensesHandler
);

export default router;