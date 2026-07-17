import pg from "pg";

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
    throw new Error("Missing SUPABASE_DB_URL");
}

export const pool = new pg.Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined,
});