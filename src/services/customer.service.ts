import { Prisma } from "generated/prisma/client";
import { CustomerModel } from "src/models/customer.model";
import { CustomerCreateInputs } from "src/types";
import { ApiError } from "src/utils/ApiError";

export class CustomerService {
  static async create(inputs: CustomerCreateInputs) {
    const customer = await CustomerModel.create(inputs);

    return customer;
  }

  static async getAll() {
    const customer = await CustomerModel.findAll();

    return customer;
  }

  static async getById(id: string) {
    const customer = await CustomerModel.findById(id);

    return customer;
  }

  static async getByPhone(phone: string) {
    const customer = await CustomerModel.findByPhone(phone);

    return customer;
  }

  static async getByEmail(email: string) {
    const customer = await CustomerModel.findByEmail(email);

    return customer;
  }

  static async getByName(name: string) {
    const customer = await CustomerModel.findByName(name);

    return customer;
  }

  static async edit(id: string, data: Prisma.CustomerUpdateInput) {
    const customer = await CustomerModel.update(id, data);
    
    return customer;
  }  
  
  static async delete(id: string) {
    const customer = await CustomerModel.delete(id);
    
    return customer;
  }
}
