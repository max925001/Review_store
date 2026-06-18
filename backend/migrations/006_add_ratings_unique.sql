-- Add unique constraint to prevent duplicate ratings by the same user for a store
ALTER TABLE ratings ADD CONSTRAINT unique_user_store_rating UNIQUE (store_id, user_id);
