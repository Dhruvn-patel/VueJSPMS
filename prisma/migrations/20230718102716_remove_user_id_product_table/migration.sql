/*
  Warnings:

  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Product_userId_fkey` ON `Product`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `userId`;
