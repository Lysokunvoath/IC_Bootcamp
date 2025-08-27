-- 0005_fix_meetups_group_id_type.sql
-- This migration fixes the data type of meetups.group_id from integer to uuid
-- and re-establishes the foreign key constraint to groups.id.
-- WARNING: Existing integer values in meetups.group_id will be set to NULL.
-- Ensure you have backed up your data if this is a production environment.

-- Drop the existing (and likely incorrect/failed) foreign key constraint
ALTER TABLE meetups DROP CONSTRAINT IF EXISTS fk_group;

-- Alter the column type to uuid.
-- Existing integer values will be set to NULL as they cannot be cast to uuid.
ALTER TABLE meetups ALTER COLUMN group_id TYPE uuid USING NULL;

-- Add the correct foreign key constraint
ALTER TABLE meetups
ADD CONSTRAINT fk_group
FOREIGN KEY (group_id)
REFERENCES groups(id);
