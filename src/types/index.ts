import type { TicketStatus, UserRole } from "generated/prisma/enums";

// export type UserRole = "ADMIN" | "RECEPTION" | "TECHNICIAN" | "STORE_MANAGER";
export type UserSignupInputs = {
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  password: string;
  passwordConfirm: string;
  updateAt?: string;
};

export type UserLoginInputs = {
  email: string;
  password: string;
};

export type CustomerCreateInputs = {
  name: string;
  phone: string;
  email?: string;
};

export type CreateTicketInputs = {
  customerId: string;
  urgent: boolean;
  assignedTechId?: string;
  deviceId: string;
  status?: TicketStatus;
};
