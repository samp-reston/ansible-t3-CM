-- DropForeignKey
ALTER TABLE `hostvariables` DROP FOREIGN KEY `hostVariables_hostId_fkey`;

-- AddForeignKey
ALTER TABLE `HostVariables` ADD CONSTRAINT `HostVariables_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `Hosts`(`hostname`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `hosts` RENAME INDEX `hosts_rigId_key` TO `Hosts_rigId_key`;

-- RenameIndex
ALTER TABLE `hostvariables` RENAME INDEX `hostVariables_intrepid_key` TO `HostVariables_intrepid_key`;

-- RenameIndex
ALTER TABLE `hostvariables` RENAME INDEX `hostVariables_niHostname_key` TO `HostVariables_niHostname_key`;

-- RenameIndex
ALTER TABLE `hostvariables` RENAME INDEX `hostVariables_vin_key` TO `HostVariables_vin_key`;
