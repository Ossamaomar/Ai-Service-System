-- AlterTable
ALTER TABLE `user` ADD COLUMN `isPhoneVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `otpAttempts` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `otpExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `phoneVerificationOTP` VARCHAR(191) NULL;
