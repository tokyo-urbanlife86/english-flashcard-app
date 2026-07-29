ALTER TABLE "User"
RENAME COLUMN "encrypted_password" TO "password_hash";

ALTER TABLE "Sentence"
RENAME COLUMN "statusUpdated_at" TO "status_updated_at";
