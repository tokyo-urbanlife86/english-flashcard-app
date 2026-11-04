-- ユーザーに紐づかない古い文章（どの画面からも見えないもの）を削除する
DELETE FROM "Sentence" WHERE "user_id" IS NULL;

-- セット未設定の文章を、そのユーザーの最も古いセットに入れる
UPDATE "Sentence" AS s
SET "flashcard_set_id" = (
  SELECT f."id"
  FROM "FlashcardSet" AS f
  WHERE f."user_id" = s."user_id"
  ORDER BY f."created_at"
  LIMIT 1
)
WHERE s."flashcard_set_id" IS NULL;

-- セットを持たないユーザーの文章が残っていれば削除する
DELETE FROM "Sentence" WHERE "flashcard_set_id" IS NULL;

-- 未使用の列を削除する
ALTER TABLE "Sentence" DROP COLUMN "casualText",
DROP COLUMN "formalText";

-- 必須にする
ALTER TABLE "Sentence" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "flashcard_set_id" SET NOT NULL;

-- セット削除時に文章も削除されるようにする
ALTER TABLE "Sentence" DROP CONSTRAINT "Sentence_flashcard_set_id_fkey";
ALTER TABLE "Sentence" ADD CONSTRAINT "Sentence_flashcard_set_id_fkey" FOREIGN KEY ("flashcard_set_id") REFERENCES "FlashcardSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
