import { pool } from "../utils/db";

export const createUser = async (
    username: string,
    passwordHash: string
) => {
    return pool.query(
        `
        INSERT INTO users(username,password_hash)
        VALUES($1,$2)
        `,
        [username, passwordHash]
    );
};

export async function findUser(username: string) {
  const result = await pool.query(
    `
    SELECT id,
           username,
           password_hash
    FROM users
    WHERE username = $1
    LIMIT 1
    `,
    [username]
  );

  return result.rows[0];
}


export const saveRefreshToken = async (
    username: string,
    token: string
) => {
    return pool.query(
        `
        UPDATE users
        SET refresh_token=$1
        WHERE username=$2
        `,
        [token, username]
    );
};

export const removeRefreshToken = async (
    token: string
) => {
    return pool.query(
        `
        UPDATE users
        SET refresh_token=NULL
        WHERE refresh_token=$1
        `,
        [token]
    );
};