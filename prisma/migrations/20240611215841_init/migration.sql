-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationCode" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
