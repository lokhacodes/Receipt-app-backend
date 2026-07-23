import { pool } from "../utils/db";

import {
  CreateExpenseDTO,
  UpdateExpenseDTO,
  Expense,
} from "../models/expense.model";

/* ==========================================
   MAP RAW DB ROW TO FRONTEND-EXPECTED SHAPE
========================================== */

function mapExpense(row: any): Expense {
  return {
    id: row.id,
    expense: row.expense,
    merchant: row.merchant,
    address: row.address,
    amount: Number(row.amount),
    currency: row.currency,
    quantity: row.quantity,
    category: row.category,
    description: row.description,
    notes: row.notes,
    date: row.expense_date,
    inReport: row.in_report,
  };
}

/* ==========================================
   CREATE EXPENSE
========================================== */

export async function createExpense(
  userId: string,
  data: CreateExpenseDTO
): Promise<Expense> {
  const query = `
    INSERT INTO expenses (
      user_id,
      expense,
      merchant,
      address,
      amount,
      currency,
      quantity,
      category,
      description,
      notes,
      expense_date
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
    )
    RETURNING *;
  `;

  const values = [
    userId,
    data.expense,
    data.merchant,
    data.address,
    data.amount,
    data.currency,
    data.quantity,
    data.category,
    data.description,
    data.notes,
    data.expense_date,
  ];

  const result = await pool.query(query, values);

  return mapExpense(result.rows[0]);
}

/* ==========================================
   GET ALL EXPENSES
========================================== */

export async function getExpenses(
  userId: string
): Promise<Expense[]> {
  const result = await pool.query(
    `
    SELECT *
    FROM expenses
    WHERE user_id=$1
    ORDER BY expense_date DESC;
    `,
    [userId]
  );

  return result.rows.map(mapExpense);
}

/* ==========================================
   GET EXPENSE BY ID
========================================== */

export async function getExpenseById(
  id: string,
  userId: string
): Promise<Expense | null> {
  const result = await pool.query(
    `
    SELECT *
    FROM expenses
    WHERE id=$1
    AND user_id=$2;
    `,
    [id, userId]
  );

  const row = result.rows[0];

  return row ? mapExpense(row) : null;
}

/* ==========================================
   UPDATE EXPENSE
========================================== */

export async function updateExpense(
  id: string,
  userId: string,
  data: UpdateExpenseDTO
): Promise<Expense | null> {
  const query = `
    UPDATE expenses
    SET
      expense=$1,
      merchant=$2,
      address=$3,
      amount=$4,
      currency=$5,
      quantity=$6,
      category=$7,
      description=$8,
      notes=$9,
      expense_date=$10,
      in_report=$11,
      updated_at=NOW()
    WHERE id=$12
    AND user_id=$13
    RETURNING *;
  `;

  const values = [
    data.expense,
    data.merchant,
    data.address,
    data.amount,
    data.currency,
    data.quantity,
    data.category,
    data.description,
    data.notes,
    data.expense_date,
    data.in_report,
    id,
    userId,
  ];

  const result = await pool.query(query, values);

  const row = result.rows[0];

  return row ? mapExpense(row) : null;
}

/* ==========================================
   DELETE EXPENSE
========================================== */

export async function deleteExpense(
  id: string,
  userId: string
): Promise<boolean> {
  const result = await pool.query(
    `
    DELETE FROM expenses
    WHERE id=$1
    AND user_id=$2;
    `,
    [id, userId]
  );

  return result.rowCount !== null && result.rowCount > 0;
}
