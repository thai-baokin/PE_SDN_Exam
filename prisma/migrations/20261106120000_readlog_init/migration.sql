-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('Fiction', 'Non-Fiction', 'Sci-Fi', 'Biography', 'Other');

-- CreateTable ReadingLog
CREATE TABLE IF NOT EXISTS "ReadingLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookTitle" TEXT NOT NULL,
    "minutesRead" INTEGER NOT NULL,
    "genre" "Genre" NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "readOn" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ReadingLog_userId_idx" ON "ReadingLog"("userId");
CREATE INDEX IF NOT EXISTS "ReadingLog_userId_readOn_idx" ON "ReadingLog"("userId", "readOn");

-- AddForeignKey
ALTER TABLE "ReadingLog" DROP CONSTRAINT IF EXISTS "ReadingLog_userId_fkey";
ALTER TABLE "ReadingLog" ADD CONSTRAINT "ReadingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
