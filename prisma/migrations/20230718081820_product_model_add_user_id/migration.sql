-- AlterTable
ALTER TABLE `Product` ADD COLUMN `userId` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
