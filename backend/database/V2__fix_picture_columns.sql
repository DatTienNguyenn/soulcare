-- Migration to fix picture table column types for large image data
-- This migration alters the pictures table columns to use TEXT type for large data fields

ALTER TABLE pictures
  ALTER COLUMN drawing_data TYPE text,
  ALTER COLUMN image_url TYPE text,
  ALTER COLUMN metadata TYPE text;

-- Add NOT NULL constraint and defaults if needed
ALTER TABLE pictures
  ALTER COLUMN status SET DEFAULT 'PUBLISHED',
  ALTER COLUMN status SET NOT NULL;
