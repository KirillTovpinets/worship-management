/*
  Warnings:

  - You are about to drop the column `tone` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Song" DROP COLUMN "tone";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "key";
