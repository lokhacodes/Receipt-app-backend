import { pool } from "../utils/db";

export async function createReceipt(
  userId: string,
  imageUrl: string
) {
  const result = await pool.query(
    `
    INSERT INTO receipts(user_id,image_url)

    VALUES($1,$2)

    RETURNING *
    `,
    [userId, imageUrl]
  );

  return result.rows[0];
}

export async function getReceiptById(id: string) {
  const result = await pool.query(
    `
    SELECT *

    FROM receipts

    WHERE id=$1
    `,
    [id]
  );

  return result.rows[0];
}