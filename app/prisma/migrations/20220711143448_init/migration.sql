-- CreateTable
CREATE TABLE `ExecutionLogs` (
    `executionID` VARCHAR(191) NOT NULL,
    `playbook` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `started` DATETIME(3) NOT NULL,
    `ended` DATETIME(3) NOT NULL,
    `hostId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ExecutionLogs_hostId_key`(`hostId`),
    PRIMARY KEY (`executionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hosts` ADD CONSTRAINT `Hosts_hostname_fkey` FOREIGN KEY (`hostname`) REFERENCES `ExecutionLogs`(`hostId`) ON DELETE RESTRICT ON UPDATE CASCADE;
