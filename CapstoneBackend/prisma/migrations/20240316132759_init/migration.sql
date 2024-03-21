-- AlterTable
ALTER TABLE `users` ADD COLUMN `address` VARCHAR(100) NULL,
    ADD COLUMN `dob` VARCHAR(20) NULL,
    ADD COLUMN `firstname` VARCHAR(40) NULL,
    ADD COLUMN `isactive` BOOLEAN NULL,
    ADD COLUMN `lastname` VARCHAR(40) NULL,
    ADD COLUMN `postalcode` VARCHAR(10) NULL,
    ADD COLUMN `profileimage` VARCHAR(200) NULL;
