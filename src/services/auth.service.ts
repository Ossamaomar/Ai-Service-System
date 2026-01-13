import { UserModel } from "src/models/user.model";
import { ApiError } from "src/utils/ApiError";
import { compare, hash } from "bcrypt";
import type { UserLoginInputs, UserSignupInputs } from "src/types";
import { UserCreateInput } from "generated/prisma/models";
import z, { ZodError } from "zod";
import {
  forgetPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  userLoginSchema,
  userSignupSchema,
} from "src/utils/validation";
import {
  createPasswordResetToken,
  signToken,
  validateData,
} from "src/utils/helpers";
import { createHash } from "crypto";
import { EmailService } from "./email.service";
import { User } from "generated/prisma/client";
import { OTPUtil } from "src/utils/otp";
import { OTPService } from "./otp.service";
import { prisma } from "src/config/database";

export class AuthService {
  static async signup(signupInputs: any) {
    const validatedData = validateData(userSignupSchema, signupInputs);
    // validatedData.email = validatedData.email.toLowerCase();

    const { name, email, phone, password, role } = validatedData;

    // Hash password before transaction
    const hashedPassword = await hash(password, 12);

    // Generate OTP before transaction
    const { otp, expiresAt } = OTPUtil.generateWithExpiry();
    const hashedOtp = OTPUtil.hash(otp);

    // Execute everything in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Check if user exists (inside transaction for ACID)
      const existingUser = await tx.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.isPhoneVerified === true) {
        throw new ApiError(400, "User with this email already exists");
      }

      if (existingUser && existingUser.isPhoneVerified === false) {
        try {
          console.log("Existing phone: ", existingUser.phone);
          await tx.user.update({
            where: { id: existingUser.id },
            data: {
              phoneVerificationOTP: hashedOtp,
              otpExpiresAt: expiresAt,
              otpAttempts: 0,
            },
          });
          await OTPService.sendSMS(existingUser.phone, otp);
          return existingUser;
        } catch (error) {
          throw new ApiError(500, "An error ourred during sending OTP");
        }
      }

      // Check if customer exists by phone
      const existingCustomer = await tx.customer.findUnique({
        where: { phone },
      });

      let newUser;

      if (existingCustomer) {
        // Customer exists - create user and link
        newUser = await tx.user.create({
          data: {
            email,
            name: existingCustomer.name,
            password: hashedPassword,
            phone,
            role,
            isPhoneVerified: false,
            phoneVerificationOTP: hashedOtp,
            otpExpiresAt: expiresAt,
            otpAttempts: 0,
          },
        });

        // Link customer to user
        await tx.customer.update({
          where: { id: existingCustomer.id },
          data: {
            email: newUser.email,
            name: newUser.name,
            user: {
              connect: { id: newUser.id },
            },
          },
        });
      } else {
        // Create both user and customer
        newUser = await tx.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            phone,
            role,
            isPhoneVerified: false,
            phoneVerificationOTP: hashedOtp,
            otpExpiresAt: expiresAt,
            otpAttempts: 0,
            customer: {
              create: {
                name,
                email,
                phone,
              },
            },
          },
          include: {
            customer: true,
          },
        });
      }

      try {
        await OTPService.sendSMS(phone, otp);
      } catch (error) {
        throw new ApiError(500, "An error occurred during sending OTP");
      }

      return newUser;
    });

    // Send OTP AFTER transaction succeeds (not part of DB transaction)

    // Remove sensitive fields
    const {
      password: _,
      phoneVerificationOTP: __,
      passwordResetToken: ___,
      passwordResetExpires: ____,
      ...userWithoutPassword
    } = user;

    return userWithoutPassword;
  }

  static async login(loginInputs: UserLoginInputs) {
    const validatedData = validateData(userLoginSchema, loginInputs);

    const user = await UserModel.findByEmail(validatedData.email);
    const isCorrectPassword = await compare(
      loginInputs.password,
      user?.password || ""
    );

    if (!user || !isCorrectPassword) {
      throw new ApiError(400, "Email or password is incorrect");
    }

    if (!user.isPhoneVerified) {
      throw new ApiError(401, "Please verify your phone number first");
    }

    const {
      password: _pw,
      passwordConfirm: _pc,
      phoneVerificationOTP: ___,
      otpExpiresAt: ____,
      otpAttempts: _____,
      passwordResetToken: ______,
      passwordResetExpires: _______,

      ...userWithoutPassword
    } = user;
    return userWithoutPassword;
  }

  static async forgetPassword(data: { email: string }) {
    // 1. Get user
    const validatedData = validateData(forgetPasswordSchema, data);
    const user = await UserModel.findByEmail(validatedData.email);

    if (!user) {
      throw new ApiError(400, "This user doesn't exist");
    }

    const resetToken = createPasswordResetToken();

    const resetTokenHash = createHash("sha256")
      .update(resetToken)
      .digest("hex");
    // Save hashed token to database
    await UserModel.update(user.id, {
      passwordResetToken: resetTokenHash,
      passwordResetExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
    });

    // Send reset email
    await EmailService.sendPasswordResetEmail(
      { name: user.name, email: user.email },
      resetToken
    );

    // console.log(passwordResetToken, passwordResetExpires);
  }

  static async resetPassword(
    token: string,
    data: { password: string; passwordConfirm: string }
  ) {
    const validatedData = validateData(resetPasswordSchema, data);

    const hashedToken = createHash("sha256").update(token).digest("hex");

    const user = await UserModel.findByResetToken(hashedToken);
    if (!user) {
      throw new ApiError(400, "No user found");
    }

    const isExpired = new Date(Date.now()) > user.passwordResetExpires;

    if (isExpired) {
      throw new ApiError(
        403,
        "Reset token expired please send a reset request again"
      );
    }
    const hashedPassword = await hash(validatedData.password, 12);

    return await UserModel.update(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordChangedAt: new Date().toISOString(),
      passwordResetExpires: new Date().toISOString(),
    });
  }

  static async updatePassword(
    user: User,
    data: { currentPassword: string; password: string; passwordConfirm: string }
  ) {
    const validatedData = validateData(updatePasswordSchema, data);

    const isCorrectPassword = await compare(
      validatedData.currentPassword,
      user.password
    );
    console.log(isCorrectPassword);
    if (!isCorrectPassword) {
      throw new ApiError(400, "Current password is not correct");
    }

    const hashedPassword = await hash(validatedData.password, 12);

    // const token = signToken(user.id);

    return await UserModel.update(user.id, {
      password: hashedPassword,
      passwordChangedAt: new Date().toISOString(),
    });
  }

  static async verifyOTP(phone: string, otp: string) {
    const user = await UserModel.findByPhone(phone);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isPhoneVerified) {
      throw new ApiError(400, "Phone already verified");
    }

    if (!user.phoneVerificationOTP || !user.otpExpiresAt) {
      throw new ApiError(
        400,
        "No OTP request found. Please request a new OTP."
      );
    }

    // Check if OTP expired
    if (OTPUtil.isExpired(user.otpExpiresAt)) {
      throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    // Check attempts (prevent brute force)
    if (user.otpAttempts >= 5) {
      throw new ApiError(
        429,
        "Too many failed attempts. Please request a new OTP."
      );
    }

    // Verify OTP
    const isValid = OTPUtil.verify(otp, user.phoneVerificationOTP);

    if (!isValid) {
      // Increment failed attempts
      await UserModel.update(user.id, {
        otpAttempts: user.otpAttempts + 1,
      });

      throw new ApiError(400, "Invalid OTP. Please try again.");
    }

    // OTP is valid - verify user
    const updatedUser = await UserModel.update(user.id, {
      isPhoneVerified: true,
      phoneVerificationOTP: null,
      otpExpiresAt: null,
      otpAttempts: 0,
    });

    // Generate token
    const token = signToken(updatedUser.id);

    const {
      password: _,
      phoneVerificationOTP: __,
      ...userWithoutSensitive
    } = updatedUser;

    return userWithoutSensitive;
  }

  static async resendOTP(phone: string) {
    const user = await UserModel.findByPhone(phone);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isPhoneVerified) {
      throw new ApiError(400, "Phone already verified");
    }

    // Generate new OTP
    const { otp, expiresAt } = OTPUtil.generateWithExpiry();
    const hashedOtp = OTPUtil.hash(otp);

    // Update user with new OTP
    await UserModel.update(user.id, {
      phoneVerificationOTP: hashedOtp,
      otpExpiresAt: expiresAt,
      otpAttempts: 0, // Reset attempts
    });

    // Send OTP
    await OTPService.sendSMS(phone, otp);

    return {
      message: "New OTP sent to your phone.",
    };
  }
}
