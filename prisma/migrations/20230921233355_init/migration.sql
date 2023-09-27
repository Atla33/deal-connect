/*
  Warnings:

  - A unique constraint covering the columns `[userId,favoritedUserId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `favoritedUserId` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "favoritedUserId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_favoritedUserId_key" ON "Favorite"("userId", "favoritedUserId");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_favoritedUserId_fkey" FOREIGN KEY ("favoritedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
