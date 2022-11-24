/*
  Warnings:

  - A unique constraint covering the columns `[rigName]` on the table `HostVariables` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rigName` to the `HostVariables` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hostvariables` ADD COLUMN `rigName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `HostVariables_rigName_key` ON `HostVariables`(`rigName`);
