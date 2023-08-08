/*
  Warnings:

  - You are about to drop the `UserRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserRoles` DROP FOREIGN KEY `UserRoles_rolesId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRoles` DROP FOREIGN KEY `UserRoles_userId_fkey`;

-- DropTable
DROP TABLE `UserRoles`;

-- CreateTable
CREATE TABLE `UserPermissions` (
    `userId` INTEGER NOT NULL,
    `permissionsId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `permissionsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserPermissions` ADD CONSTRAINT `UserPermissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermissions` ADD CONSTRAINT `UserPermissions_permissionsId_fkey` FOREIGN KEY (`permissionsId`) REFERENCES `Permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
