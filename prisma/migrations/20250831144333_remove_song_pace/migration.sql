/*
  Warnings:

  - You are about to drop the column `pace` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Song" DROP COLUMN "pace";

-- DropEnum
DROP TYPE "public"."SongPace";
