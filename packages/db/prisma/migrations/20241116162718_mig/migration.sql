-- CreateTable
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "spaceName" TEXT NOT NULL,
    "headerName" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "msg" TEXT NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "videoUrl" TEXT,
    "text" TEXT,
    "SpaceId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Space_id_key" ON "Space"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Space_spaceName_key" ON "Space"("spaceName");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_SpaceId_fkey" FOREIGN KEY ("SpaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
