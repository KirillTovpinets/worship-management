-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."SongKey" ADD VALUE 'Cm';
ALTER TYPE "public"."SongKey" ADD VALUE 'C_SHARP_M';
ALTER TYPE "public"."SongKey" ADD VALUE 'Dm';
ALTER TYPE "public"."SongKey" ADD VALUE 'Eb';
ALTER TYPE "public"."SongKey" ADD VALUE 'Ebm';
ALTER TYPE "public"."SongKey" ADD VALUE 'Em';
ALTER TYPE "public"."SongKey" ADD VALUE 'Fm';
ALTER TYPE "public"."SongKey" ADD VALUE 'F_SHARP_M';
ALTER TYPE "public"."SongKey" ADD VALUE 'Gm';
ALTER TYPE "public"."SongKey" ADD VALUE 'G_SHARP_M';
ALTER TYPE "public"."SongKey" ADD VALUE 'Am';
ALTER TYPE "public"."SongKey" ADD VALUE 'Bb';
ALTER TYPE "public"."SongKey" ADD VALUE 'Bbm';
