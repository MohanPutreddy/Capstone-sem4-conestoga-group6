-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookname` VARCHAR(45) NOT NULL,
    `authorname` VARCHAR(45) NOT NULL,
    `price` VARCHAR(45) NOT NULL,
    `description` VARCHAR(45) NULL,
    `image` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
