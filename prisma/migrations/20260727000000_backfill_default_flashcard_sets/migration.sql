INSERT INTO "FlashcardSet" (
  "id",
  "name",
  "user_id",
  "created_at",
  "updated_at"
)
SELECT
  gen_random_uuid()::text,
  'マイセット',
  "User"."id",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "User"
WHERE NOT EXISTS (
  SELECT 1
  FROM "FlashcardSet"
  WHERE "FlashcardSet"."user_id" = "User"."id"
);
