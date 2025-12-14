/*
  Warnings:

  - The values [RECEPTION] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'RECEPTIONIST', 'TECHNICIAN', 'STORE_MANAGER', 'CUSTOMER') NOT NULL;
