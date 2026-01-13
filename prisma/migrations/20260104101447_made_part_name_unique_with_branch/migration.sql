/*
  Warnings:

  - A unique constraint covering the columns `[name,branch]` on the table `Part` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Part_name_branch_key` ON `Part`(`name`, `branch`);
