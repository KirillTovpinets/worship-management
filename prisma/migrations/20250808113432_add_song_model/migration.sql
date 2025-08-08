-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "originalSinger" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pace" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "nature" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
