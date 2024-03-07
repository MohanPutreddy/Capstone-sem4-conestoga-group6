/*
  Warnings:

  - Added the required column `categoryid` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `categoryid` INTEGER NOT NULL,
    ADD COLUMN `stock` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
