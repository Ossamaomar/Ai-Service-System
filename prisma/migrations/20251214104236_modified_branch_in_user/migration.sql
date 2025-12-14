/*
  Warnings:

  - You are about to alter the column `branch` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `branch` ENUM('FARQ', 'SOUQ') NULL;
