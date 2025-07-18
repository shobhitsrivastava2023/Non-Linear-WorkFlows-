-- Add unique constraint to github_id column to prevent multiple users from linking the same GitHub account
ALTER TABLE "User" 
ADD CONSTRAINT unique_github_id 
UNIQUE (github_id) 
WHERE github_id IS NOT NULL;