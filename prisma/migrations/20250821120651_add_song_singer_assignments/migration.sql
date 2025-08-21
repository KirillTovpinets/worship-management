-- CreateTable
CREATE TABLE "public"."SongSinger" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "singerId" TEXT NOT NULL,
    "key" "public"."SongKey" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongSinger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SongSinger_songId_singerId_key" ON "public"."SongSinger"("songId", "singerId");

-- AddForeignKey
ALTER TABLE "public"."SongSinger" ADD CONSTRAINT "SongSinger_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongSinger" ADD CONSTRAINT "SongSinger_singerId_fkey" FOREIGN KEY ("singerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
