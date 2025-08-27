ALTER TABLE meetups
ADD CONSTRAINT fk_group
FOREIGN KEY (group_id)
REFERENCES groups(id);