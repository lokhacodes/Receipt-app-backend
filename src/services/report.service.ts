import { pool } from "../utils/db";

import {
  CreateReportDTO,
  UpdateReportDTO,
  Report,
} from "../models/report.model";

/* ==========================================
   CREATE REPORT
========================================== */

export async function createReport(
  userId: string,
  data: CreateReportDTO
): Promise<Report> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* Calculate total amount */

    const totalResult = await client.query(
      `
      SELECT COALESCE(SUM(amount),0) AS total
      FROM expenses
      WHERE id = ANY($1)
      AND user_id = $2;
      `,
      [data.expenseIds, userId]
    );

    const total = Number(totalResult.rows[0].total);

    /* Create report */

    const reportResult = await client.query(
      `
      INSERT INTO reports (
        user_id,
        title,
        description,
        currency,
        status,
        total_amount
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
      `,
      [
        userId,
        data.title,
        data.description,
        data.currency,
        data.status ?? "draft",
        total,
      ]
    );

    const report = reportResult.rows[0];

    /* Link expenses */

    for (const expenseId of data.expenseIds) {
      await client.query(
        `
        INSERT INTO report_expenses (
          report_id,
          expense_id
        )
        VALUES ($1,$2);
        `,
        [report.id, expenseId]
      );
    }

    /* Mark expenses as used */

    await client.query(
      `
      UPDATE expenses
      SET
        in_report = TRUE,
        updated_at = NOW()
      WHERE id = ANY($1)
      AND user_id = $2;
      `,
      [data.expenseIds, userId]
    );

    await client.query("COMMIT");

    return report;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/* ==========================================
   GET ALL REPORTS
========================================== */

export async function getReports(
  userId: string
): Promise<Report[]> {
  const result = await pool.query(
    `
    SELECT *
    FROM reports
    WHERE user_id=$1
    ORDER BY created_at DESC;
    `,
    [userId]
  );

  return result.rows;
}

/* ==========================================
   GET REPORT BY ID
========================================== */

export async function getReportById(
  id: string,
  userId: string
): Promise<Report | null> {
  const result = await pool.query(
    `
    SELECT *
    FROM reports
    WHERE id=$1
    AND user_id=$2;
    `,
    [id, userId]
  );

  return result.rows[0] || null;
}

/* ==========================================
   UPDATE REPORT
========================================== */

export async function updateReport(
  id: string,
  userId: string,
  data: UpdateReportDTO
): Promise<Report | null> {
  const result = await pool.query(
    `
    UPDATE reports
    SET
      title=$1,
      description=$2,
      currency=$3,
      status=$4,
      updated_at=NOW()
    WHERE id=$5
    AND user_id=$6
    RETURNING *;
    `,
    [
      data.title,
      data.description,
      data.currency,
      data.status,
      id,
      userId,
    ]
  );

  return result.rows[0] || null;
}

/* ==========================================
   GET REPORT EXPENSES
========================================== */

export async function getReportExpenses(
  reportId: string,
  userId: string
) {
  const result = await pool.query(
    `
    SELECT
      e.*
    FROM report_expenses re
    INNER JOIN expenses e
      ON re.expense_id = e.id
    WHERE
      re.report_id = $1
      AND e.user_id = $2
    ORDER BY e.expense_date DESC;
    `,
    [reportId, userId]
  );

  return result.rows;
}


/* ==========================================
   DELETE REPORT
========================================== */

export async function deleteReport(
  id: string,
  userId: string
): Promise<boolean> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* Get linked expenses */

    const expenses = await client.query(
      `
      SELECT expense_id
      FROM report_expenses
      WHERE report_id=$1;
      `,
      [id]
    );

    const expenseIds = expenses.rows.map(
      (row) => row.expense_id
    );

    /* Remove report */

    const deleted = await client.query(
      `
      DELETE FROM reports
      WHERE id=$1
      AND user_id=$2;
      `,
      [id, userId]
    );

    /* Reset expense status */

    if (expenseIds.length > 0) {
      await client.query(
        `
        UPDATE expenses
        SET
          in_report=FALSE,
          updated_at=NOW()
        WHERE id = ANY($1);
        `,
        [expenseIds]
      );
    }

    await client.query("COMMIT");

    return deleted.rowCount !== null && deleted.rowCount > 0;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}