/*
  Warnings:

  - Made the column `branch` on table `part` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `part` MODIFY `branch` ENUM('FARQ', 'SOUQ') NOT NULL;
