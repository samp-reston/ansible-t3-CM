-- CreateTable
CREATE TABLE `GroupBaseline` (
    `groupId` VARCHAR(191) NOT NULL,
    `assetBridge` VARCHAR(191) NULL,
    `gcpUploader` VARCHAR(191) NULL,
    `cssLaunch` VARCHAR(191) NULL,
    `corvus` VARCHAR(191) NULL,
    `corvusParallel` VARCHAR(191) NULL,
    `vehicleSpy` VARCHAR(191) NULL,
    `jlrSDK` VARCHAR(191) NULL,

    PRIMARY KEY (`groupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hosts` ADD CONSTRAINT `Hosts_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `GroupBaseline`(`groupId`) ON DELETE SET NULL ON UPDATE CASCADE;
