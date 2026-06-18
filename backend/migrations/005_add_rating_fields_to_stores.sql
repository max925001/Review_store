-- Alter stores table to add total_review_user and avgrating columns
ALTER TABLE stores ADD COLUMN IF NOT EXISTS total_review_user INT DEFAULT 0;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS avgrating NUMERIC(2, 1) DEFAULT 0.0;
