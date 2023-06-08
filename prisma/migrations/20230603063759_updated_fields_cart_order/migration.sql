-- AlterTable
ALTER TABLE `Cart` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;
