import { pool } from "../utils/db";

export const createUser = async (
    name: string,
    email: string,
    passwordHash: string
) => {
    return pool.query(
        `
        INSERT INTO users(name, email, password_hash)
        VALUES($1,$2,$3)
        `,
        [name, email, passwordHash]
    );
};

export async function findUser(email: string) {
  const result = await pool.query(
    `
    SELECT id,
           name,
           email,
           password_hash
    FROM users
    WHERE email = $1
    LIMIT 1
    `,
    [email]
  );

  return result.rows[0];
}


export const saveRefreshToken = async (
    email: string,
    token: string
) => {
    return pool.query(
        `
        UPDATE users
        SET refresh_token=$1
        WHERE email=$2
        `,
        [token, email]
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
