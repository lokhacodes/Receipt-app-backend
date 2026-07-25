-- Migration: Add email and name columns, rename username to email
-- Run this in your Supabase SQL editor

-- Add new columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Copy existing username data to email column
UPDATE users SET email = username WHERE email IS NULL;

-- Make email NOT NULL after data migration
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Drop old username column
ALTER TABLE users DROP COLUMN IF EXISTS username;

-- Add index on email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

