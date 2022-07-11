-- DropIndex
DROP INDEX `hosts_hostname_key` ON `hosts`;

-- AlterTable
ALTER TABLE `hosts` ADD PRIMARY KEY (`hostname`);
