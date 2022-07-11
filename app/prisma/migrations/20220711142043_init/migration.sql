-- CreateTable
CREATE TABLE `HostBaseline` (
    `hostId` VARCHAR(191) NOT NULL,
    `assetBridge` VARCHAR(191) NULL,
    `gcpUploader` VARCHAR(191) NULL,
    `cssLaunch` VARCHAR(191) NULL,
    `corvus` VARCHAR(191) NULL,
    `corvusParallel` VARCHAR(191) NULL,
    `vehicleSpy` VARCHAR(191) NULL,
    `jlrSDK` VARCHAR(191) NULL,

    PRIMARY KEY (`hostId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HostBaseline` ADD CONSTRAINT `HostBaseline_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `Hosts`(`hostname`) ON DELETE RESTRICT ON UPDATE CASCADE;
