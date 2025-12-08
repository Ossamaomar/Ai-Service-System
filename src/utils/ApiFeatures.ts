export class APIFeatures {
  query: any;
  options: {
    skip: number;
    take: number;
    where: any;
    orderBy: any;
    select?: any;
  };
  constructor(query: any) {
    this.query = query;

    this.options = {
      skip: 0,
      take: 0,
      where: {},
      orderBy: {},
      select: {},
    };
  }

  filter() {
    const queryObj = { ...this.query };
    const excludedFields = ["page", "sort", "limit", "fields", "take"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const isNumericString = (value: any): boolean => {
      if (typeof value !== "string") return false;
      // Check if string represents a valid number (including decimals and negatives)
      return (
        !isNaN(Number(value)) &&
        !isNaN(parseFloat(value)) &&
        value.trim() !== ""
      );
    };

    const convertNumericFilters = (obj: any): any => {
      if (!obj || typeof obj !== "object") return obj;

      for (const [key, value] of Object.entries(obj)) {
        // Skip null or undefined values
        if (value == null) continue;

        // Case 1: Value is an object (could be nested filters like {gt: "100"} or nested queries)
        if (typeof value === "object" && !Array.isArray(value)) {
          // Check if it's a filter operator object (gt, gte, lt, lte, etc.)
          const operators = [
            "gt",
            "gte",
            "lt",
            "lte",
            "equals",
            "not",
            "in",
            "notIn",
          ];
          const hasOperators = Object.keys(value).some((k) =>
            operators.includes(k)
          );

          if (hasOperators) {
            // Process operator values
            for (const [op, opValue] of Object.entries(value)) {
              if (opValue == null) continue;

              // Handle array values (for 'in' and 'notIn' operators)
              if (Array.isArray(opValue)) {
                obj[key][op] = opValue.map((v) =>
                  isNumericString(v) ? Number(v) : v
                );
              }
              // Handle single values
              else if (isNumericString(opValue)) {
                obj[key][op] = Number(opValue);
              }
              // Handle nested objects recursively
              else if (typeof opValue === "object") {
                convertNumericFilters(opValue);
              }
            }
          } else {
            // It's a nested query (like relations), recurse into it
            convertNumericFilters(value);
          }
        }
        // Case 2: Value is an array
        else if (Array.isArray(value)) {
          obj[key] = value.map((v) =>
            isNumericString(v)
              ? Number(v)
              : typeof v === "object"
              ? convertNumericFilters(v)
              : v
          );
        }
        // Case 3: Direct value - convert if numeric string
        else if (isNumericString(value)) {
          obj[key] = Number(value);
        }
      }

      return obj;
    };

    convertNumericFilters(queryObj);
    console.log(queryObj);
    this.options.where = queryObj;
    return this;
  }

  sort() {
    if (this.query.sort) {
      let orderBy: any = {};
      const sortStr = this.query.sort as string;
      const sortKey = sortStr.startsWith("-")
        ? sortStr.replace("-", "")
        : sortStr;

      if (sortStr.startsWith("-")) {
        orderBy[`${sortKey}`] = "desc";
      } else {
        orderBy[`${sortKey}`] = "asc";
      }

      this.options.orderBy = orderBy;
    } else {
      this.options.orderBy = { createdAt: "desc" };
    }
    return this;
  }

  select() {
    // 4. Fields limiting
    if (this.query?.fields as string) {
      const fields: any = {};
      const fieldsQuery = this.query.fields as string;
      const fieldsArr = fieldsQuery.split(",");
      fieldsArr.unshift("id");
      fieldsArr.forEach((field) => (fields[`${field}`] = true));

      this.options.select = fields;
    } else {
      delete this.options["select"];
    }
    // else {
    //   this.dbQuery = this.dbQuery.select("-__v");
    // }
    return this;
  }

  paginate() {
    // 5. Pagination
    const page = Number(this.query.page) || 1;
    const take = Number(this.query.take) || 10;
    const skip = (page - 1) * take;
    this.options.skip = skip;
    this.options.take = take;

    return this;
  }
}
