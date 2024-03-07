-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryid_fkey` FOREIGN KEY (`categoryid`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
