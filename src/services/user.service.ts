import { hash } from "bcrypt";
import { UserCreateInput, UserUpdateInput } from "generated/prisma/models";
import { CustomerModel } from "src/models/customer.model";
import { UserModel } from "src/models/user.model";
import { ApiError } from "src/utils/ApiError";
import { APIFeatures } from "src/utils/ApiFeatures";
import { validateData } from "src/utils/helpers";
import {
  updateUserSchema,
  userSignupSchema,
  userUpdateSchema,
} from "src/utils/validation";

export class UserService {
  static async createUser(data: UserCreateInput) {
    const validatedData = validateData(userSignupSchema, data);

    const { name, email, phone, password, role, branch } = validatedData;
    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }

    if (role === "RECEPTIONIST" && !branch) {
      throw new ApiError(400, "Please provide a branch for the receptionist");
    }

    if (role === "TECHNICIAN" && !branch) {
      throw new ApiError(400, "Please provide a branch for the technician");
    }

    const hashedPassword = await hash(password, 12);

    const user = await UserModel.create({
      email,
      name,
      password: hashedPassword,
      phone,
      role,
      isPhoneVerified: true,
      ...(role === "RECEPTIONIST" && { branch: branch }),
      ...(role === "TECHNICIAN" && { branch: branch }),
    });

    const {
      password: _pw,
      passwordConfirm: _pc,
      phoneVerificationOTP: __,
      otpExpiresAt: ___,
      otpAttempts: ____,
      passwordResetToken: _____,
      passwordResetExpires: ______,
      ...userWithoutPassword
    } = user;

    return userWithoutPassword;
  }

  static async getAllUsers(reqQuery: any) {
    const query = new APIFeatures(reqQuery).filter().select().sort().paginate();
    const users = await UserModel.findAll(query.options);

    return users;
  }

  static async getUser(id: any) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const {
      password: _pw,
      passwordConfirm: _pc,
      ...userWithoutPassword
    } = user;
    return userWithoutPassword;
  }

  static async getUserByEmail(email: any) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const {
      password: _pw,
      passwordConfirm: _pc,
      ...userWithoutPassword
    } = user;
    return userWithoutPassword;
  }

  static async getUserByPhone(phone: any) {
    const user = await UserModel.findByPhone(phone);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const {
      password: _pw,
      passwordConfirm: _pc,
      ...userWithoutPassword
    } = user;
    return userWithoutPassword;
  }

  static async updateUser(id: string, data: UserUpdateInput) {
    let validatedData = validateData(userUpdateSchema, data);

    if (validatedData?.password) {
      const hashedPassword = await hash(validatedData.password, 12);
      validatedData = { ...validatedData, password: hashedPassword };
      const { passwordConfirm: _pw, ...validatedDataWithoutPasswordConfirm } =
        validatedData;
      validatedData = validatedDataWithoutPasswordConfirm;
    }

    const user = await UserModel.update(id, validatedData);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const {
      password: _pw,
      passwordConfirm: _pc,
      ...userWithoutPassword
    } = user;
    return userWithoutPassword;
    // return validatedData;
  }

  static async updateCurrentUser(
    id: string,
    data: { name?: string; email?: string; phone?: string }
  ) {
    const validatedData = validateData(updateUserSchema, data);

    const user = await UserModel.updateCurrent(id, validatedData);
    const {
      password: _pw,
      passwordConfirm: _pc,
      passwordResetToken: _t,
      passwordResetExpires: _r,
      ...userFiltered
    } = user;

    return userFiltered;
  }

  static async deleteUser(id: string) {
    const user = await UserModel.delete(id);

    return user;
  }

  static async getTechniciansOverview(reqQuery: any) {
    const technicians = await UserModel.getTechniciansOverview(reqQuery);

    return technicians;
  }
}
