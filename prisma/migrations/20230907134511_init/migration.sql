/*
  Warnings:

  - You are about to drop the `StockOfDay` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StockOfDay" DROP CONSTRAINT "StockOfDay_productId_fkey";

-- DropTable
DROP TABLE "StockOfDay";
