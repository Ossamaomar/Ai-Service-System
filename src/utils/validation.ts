import { Branches } from "generated/prisma/enums";
import { email, z } from "zod";

export const userSignupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),

    email: z.email("Please provide a valid email").trim().toLowerCase(),

    phone: z
      .string()
      .regex(
        /^[79]\d{7}$/,
        "Phone number must be an Omani number (8 digits starting with 7 or 9)"
      ),

    password: z.string().min(8, "Password must be at least 8 characters"),
    // password: z
    //   .string()
    //   .min(8)
    //   .regex(/[A-Z]/, "Must contain uppercase letter")
    //   .regex(/[a-z]/, "Must contain lowercase letter")
    //   .regex(/[0-9]/, "Must contain number")
    //   .regex(/[^A-Za-z0-9]/, "Must contain symbol"),

    passwordConfirm: z.string().min(1, "Password confirmation is required"),

    role: z
      .enum([
        "ADMIN",
        "RECEPTIONIST",
        "TECHNICIAN",
        "STORE_MANAGER",
        "CUSTOMER",
      ])
      .default("CUSTOMER"),
    branch: z.enum(Branches).optional().nullable(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const userUpdateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .optional(),

    email: z
      .email("Please provide a valid email")
      .trim()
      .toLowerCase()
      .optional(),

    phone: z
      .string()
      .regex(
        /^[79]\d{7}$/,
        "Phone number must be an Omani number (8 digits starting with 7 or 9)"
      )
      .optional(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),

    passwordConfirm: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If password is provided, passwordConfirm must be provided
    if (data.password && !data.passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordConfirm"],
        message: "Please confirm your password",
      });
    }

    // If password is provided, passwordConfirm must be provided
    if (!data.password && data.passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Please provide your password",
      });
    }

    // If both are provided, ensure they match
    if (
      data.password &&
      data.passwordConfirm &&
      data.password !== data.passwordConfirm
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordConfirm"],
        message: "Passwords do not match",
      });
    }
  });

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional(),

  email: z.email("Please provide a valid email").toLowerCase().optional(),

  phone: z
    .string()
    .regex(
      /^[79]\d{7}$/,
      "Phone number must be an Omani number (8 digits starting with 7 or 9)"
    )
    .optional(),
});

export const userLoginSchema = z.object({
  email: z.email("Please provide a valid email").trim().toLowerCase(),

  //   password: z.string().min(8, "Password must be at least 8 characters"),
  password: z.string(),
});

export const forgetPasswordSchema = z.object({
  email: z.email("Please provide a valid email").trim(),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    // password: z
    //   .string()
    //   .min(8)
    //   .regex(/[A-Z]/, "Must contain uppercase letter")
    //   .regex(/[a-z]/, "Must contain lowercase letter")
    //   .regex(/[0-9]/, "Must contain number")
    //   .regex(/[^A-Za-z0-9]/, "Must contain symbol"),

    passwordConfirm: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    // password: z
    //   .string()
    //   .min(8)
    //   .regex(/[A-Z]/, "Must contain uppercase letter")
    //   .regex(/[a-z]/, "Must contain lowercase letter")
    //   .regex(/[0-9]/, "Must contain number")
    //   .regex(/[^A-Za-z0-9]/, "Must contain symbol"),

    passwordConfirm: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const customerCreateSchema = z.object({
  name: z.string().min(2, "Minimum length for a name is two characters"),
  phone: z
    .string()
    .regex(
      /^[79]\d{7}$/,
      "Phone number must be an Omani number (8 digits starting with 7 or 9)"
    ),
  email: z.email("Please provide a valid email").toLowerCase().optional(),
});

export const customerUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Minimum length for a name is two characters")
    .optional(),
  phone: z
    .string()
    .regex(
      /^[79]\d{7}$/,
      "Phone number must be an Omani number (8 digits starting with 7 or 9)"
    )
    .optional(),
  email: z.email("Please provide a valid email").toLowerCase().optional(),
});

export const verifyOTPSchema = z.object({
  phone: z
    .string()
    .regex(
      /^[79]\d{7}$/,
      "Phone number must be an Omani number (8 digits starting with 7 or 9)"
    ),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resendOTPSchema = z.object({
  phone: z
    .string()
    .regex(
      /^[79]\d{7}$/,
      "Phone number must be an Omani number (8 digits starting with 7 or 9)"
    ),
});
