-- CreateTable
CREATE TABLE `hostVariables` (
    `hostId` VARCHAR(191) NOT NULL,
    `modelYear` INTEGER NULL,
    `model` VARCHAR(191) NULL,
    `vin` VARCHAR(191) NULL,
    `intrepid` INTEGER NULL,
    `niHostname` VARCHAR(191) NULL,
    `rigType` VARCHAR(191) NULL,
    `testUser` VARCHAR(191) NULL,
    `agent` VARCHAR(191) NULL,
    `installUser` VARCHAR(191) NULL,

    UNIQUE INDEX `hostVariables_hostId_key`(`hostId`),
    UNIQUE INDEX `hostVariables_vin_key`(`vin`),
    UNIQUE INDEX `hostVariables_intrepid_key`(`intrepid`),
    UNIQUE INDEX `hostVariables_niHostname_key`(`niHostname`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hostVariables` ADD CONSTRAINT `hostVariables_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `hosts`(`hostname`) ON DELETE RESTRICT ON UPDATE CASCADE;
