import { Prisma } from "generated/prisma/client";
import { CustomerModel } from "src/models/customer.model";
import { CustomerCreateInputs } from "src/types";
import { ApiError } from "src/utils/ApiError";
import { APIFeatures } from "src/utils/ApiFeatures";
import { validateData } from "src/utils/helpers";
import {
  customerCreateSchema,
  customerUpdateSchema,
} from "src/utils/validation";

export class CustomerService {
  static async create(inputs: CustomerCreateInputs) {
    const validatedData = validateData(customerCreateSchema, inputs);
    const customer = await CustomerModel.create(validatedData);

    return customer;
  }

  static async getAll(query: any) {
    const options = new APIFeatures(query).select().sort().filter().paginate();
    const customer = await CustomerModel.findAll(options.options);

    return customer;
  }

  static async getById(id: string) {
    const customer = await CustomerModel.findById(id);

    return customer;
  }

  static async getByPhone(phone: any) {
    const customer = await CustomerModel.findByPhone(phone);

    return customer;
  }

  static async getByEmail(email: any) {
    const customer = await CustomerModel.findByEmail(email);

    return customer;
  }

  static async getByName(name: any) {
    const customer = await CustomerModel.findByName(name);

    return customer;
  }

  static async edit(id: string, data: Prisma.CustomerUpdateInput) {
    const validatedData = validateData(customerUpdateSchema, data);
    const customer = await CustomerModel.update(id, validatedData);

    return customer;
  }

  static async delete(id: string) {
    const customer = await CustomerModel.delete(id);

    return customer;
  }

  static async getCustomersOverview(reqQuery: any) {
    const customers = await CustomerModel.getCustomersOverview(reqQuery);

    return customers;
  }
}
