/*
  Warnings:

  - You are about to drop the `SongSinger` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SongSinger" DROP CONSTRAINT "SongSinger_singerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SongSinger" DROP CONSTRAINT "SongSinger_songId_fkey";

-- DropTable
DROP TABLE "public"."SongSinger";

-- CreateTable
CREATE TABLE "public"."SongAdaptation" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "singerId" TEXT NOT NULL,
    "key" "public"."SongKey" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongAdaptation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SongAdaptation_songId_singerId_key" ON "public"."SongAdaptation"("songId", "singerId");

-- AddForeignKey
ALTER TABLE "public"."SongAdaptation" ADD CONSTRAINT "SongAdaptation_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongAdaptation" ADD CONSTRAINT "SongAdaptation_singerId_fkey" FOREIGN KEY ("singerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
