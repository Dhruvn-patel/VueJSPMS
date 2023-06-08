/*
  Warnings:

  - You are about to drop the column `productId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,userId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_productId_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `productId`,
    DROP COLUMN `total`;

-- CreateIndex
CREATE UNIQUE INDEX `Order_id_userId_key` ON `Order`(`id`, `userId`);
