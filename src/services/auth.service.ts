import { UserModel } from "src/models/user.model";
import { ApiError } from "src/utils/ApiError";
import { compare, hash } from "bcrypt";
import type { UserLoginInputs, UserSignupInputs } from "src/types";

export class AuthService {
  static async signup(signupInputs: UserSignupInputs) {
    const { email, name, password, passwordConfirm, role, phone } =
      signupInputs;
    // const existingUser = await UserModel.findByEmail(email);

    // if (existingUser) {
    //   throw new ApiError(400, "User with this email already exists");
    // }

    if (password !== passwordConfirm) {
      throw new ApiError(400, "Passwords do not match");
    }

    const hashedPassword = await hash(password, 12);

    const user = await UserModel.create({
      email,
      name,
      password: hashedPassword,
      phone: phone || "",
      role,
    });

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  static async login(loginInputs: UserLoginInputs) {
    const user: any = await UserModel.findByEmail(loginInputs.email);
    const isCorrectPassword = await compare(
      loginInputs.password,
      user?.password || ""
    );
    
    if (!user || !isCorrectPassword) {
      throw new ApiError(400, "Email or password is not correct");
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
