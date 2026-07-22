import { Response } from "express";
import { AuthRequest } from "../types/auth";

import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../services/expense.service";

/* ==========================================
   CREATE EXPENSE
========================================== */

export async function createExpenseHandler(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user.id;

    const expense = await createExpense(
      userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Expense created successfully.",
      data: expense,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create expense.",
    });
  }
}

/* ==========================================
   GET ALL EXPENSES
========================================== */

export async function getExpensesHandler(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user.id;

    const expenses = await getExpenses(userId);

    return res.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch expenses.",
    });
  }
}

/* ==========================================
   GET EXPENSE BY ID
========================================== */

export async function getExpenseHandler(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    const expense = await getExpenseById(
      id,
      userId
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    return res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch expense.",
    });
  }
}

/* ==========================================
   UPDATE EXPENSE
========================================== */

export async function updateExpenseHandler(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    const expense = await updateExpense(
      id,
      userId,
      req.body
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    return res.json({
      success: true,
      message: "Expense updated successfully.",
      data: expense,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update expense.",
    });
  }
}

/* ==========================================
   DELETE EXPENSE
========================================== */

export async function deleteExpenseHandler(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    const deleted = await deleteExpense(
      id,
      userId
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    return res.json({
      success: true,
      message: "Expense deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete expense.",
    });
  }
}