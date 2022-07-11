-- DropForeignKey
ALTER TABLE `hosts` DROP FOREIGN KEY `Hosts_hostname_fkey`;

-- DropIndex
DROP INDEX `ExecutionLogs_hostId_key` ON `executionlogs`;

-- AddForeignKey
ALTER TABLE `ExecutionLogs` ADD CONSTRAINT `ExecutionLogs_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `Hosts`(`hostname`) ON DELETE RESTRICT ON UPDATE CASCADE;
