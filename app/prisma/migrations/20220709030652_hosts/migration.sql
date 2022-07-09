/*
  Warnings:

  - You are about to drop the column `address` on the `hosts` table. All the data in the column will be lost.
  - You are about to drop the column `group` on the `hosts` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `hosts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rigId]` on the table `hosts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hostname]` on the table `hosts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hostname` to the `hosts` table without a default value. This is not possible if the table is not empty.
  - The required column `rigId` was added to the `hosts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `hosts_address_key` ON `hosts`;

-- DropIndex
DROP INDEX `hosts_id_key` ON `hosts`;

-- AlterTable
ALTER TABLE `hosts` DROP COLUMN `address`,
    DROP COLUMN `group`,
    DROP COLUMN `id`,
    ADD COLUMN `groupId` VARCHAR(191) NULL,
    ADD COLUMN `hostname` VARCHAR(191) NOT NULL,
    ADD COLUMN `rigId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `hosts_rigId_key` ON `hosts`(`rigId`);

-- CreateIndex
CREATE UNIQUE INDEX `hosts_hostname_key` ON `hosts`(`hostname`);
