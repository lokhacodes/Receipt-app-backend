import { Router, RequestHandler } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
  createExpenseHandler,
  getExpensesHandler,
  getExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
} from "../controllers/expense.controller";

const router = Router();

/* Protect all expense routes */

router.use(authenticate as RequestHandler);

/* ==========================================
   EXPENSE ROUTES
========================================== */

router.post("/", createExpenseHandler);

router.get("/", getExpensesHandler);

router.get("/:id", getExpenseHandler);

router.put("/:id", updateExpenseHandler);

router.delete("/:id", deleteExpenseHandler);

export default router;