import { Request, Response } from "express";

import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../services/expense.service";

export const createExpenseHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

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
      message: "Failed to create expense",
    });
  }
};

/* ==========================================
   GET ALL EXPENSES
========================================== */

export const getExpensesHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const expenses = await getExpenses(userId);

    return res.json({
      success: true,
      data: expenses,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
};

/* ==========================================
   GET EXPENSE BY ID
========================================== */

export const getExpenseHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const expense = await getExpenseById(
      req.params.id,
      userId
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
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
      message: "Failed to fetch expense",
    });
  }
};

/* ==========================================
   UPDATE EXPENSE
========================================== */

export const updateExpenseHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const expense = await updateExpense(
      req.params.id,
      userId,
      req.body
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update expense",
    });
  }
};

/* ==========================================
   DELETE EXPENSE
========================================== */

export const deleteExpenseHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const deleted = await deleteExpense(
      req.params.id,
      userId
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.json({
      success: true,
      message: "Expense deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete expense",
    });
  }
};