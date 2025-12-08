/*
  Warnings:

  - You are about to drop the column `defaultPrice` on the `repair` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Repair` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `repair` DROP COLUMN `defaultPrice`,
    ADD COLUMN `price` DOUBLE NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `Repair_name_key` ON `Repair`(`name`);
