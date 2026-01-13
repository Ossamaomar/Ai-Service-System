export class APIFeatures {
  query: any;
  options: {
    skip: number;
    take: number;
    where: any;
    orderBy: any;
    select?: any;
    include?: any;
  };
  constructor(query: any) {
    this.query = query;

    this.options = {
      skip: 0,
      take: 0,
      where: {},
      orderBy: {},
      select: {},
      include: {},
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

    const convertFilters = (obj: any): any => {
      if (!obj || typeof obj !== "object") return obj;

      for (const [key, value] of Object.entries(obj)) {
        if (value == null) continue;

        // Special case: deviceCode -> use `contains` instead of equals
        if (key === "deviceCode") {
          obj[key] =
            typeof value === "object" && !Array.isArray(value)
              ? { ...value } // already nested operators, leave as is
              : { contains: value };
          continue;
        }
        
        if (key === "ticketNumber") {
          obj[key] =
            typeof value === "object" && !Array.isArray(value)
              ? { ...value } // already nested operators, leave as is
              : { contains: value };
          continue;
        }

        if (key === "phone") {
          obj[key] =
            typeof value === "object" && !Array.isArray(value)
              ? { ...value } // already nested operators, leave as is
              : { contains: value };
          continue;
        }

        if (key === "name") {
          obj[key] =
            typeof value === "object" && !Array.isArray(value)
              ? { ...value } // already nested operators, leave as is
              : { contains: value };
          continue;
        }

        // Nested operator objects (gt, gte, lt, lte, equals, in, notIn, etc.)
        if (typeof value === "object" && !Array.isArray(value)) {
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
            for (const [op, opValue] of Object.entries(value)) {
              if (opValue == null) continue;

              if (Array.isArray(opValue)) {
                obj[key][op] = opValue.map((v) =>
                  !isNaN(Number(v)) ? Number(v) : v
                );
              } else if (!isNaN(Number(opValue))) {
                obj[key][op] = Number(opValue);
              } else if (typeof opValue === "object") {
                convertFilters(opValue);
              }
            }
          } else {
            // Recurse into nested objects (relations, etc.)
            convertFilters(value);
          }
        }
        // Array values
        else if (Array.isArray(value)) {
          obj[key] = value.map((v) =>
            !isNaN(Number(v))
              ? Number(v)
              : typeof v === "object"
              ? convertFilters(v)
              : v
          );
        }
        // Direct numeric string -> convert
        // else if (!isNaN(Number(value))) {
        //   obj[key] = Number(value);
        // }
      }

      return obj;
    };

    convertFilters(queryObj);
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

  include() {
    if (this.query?.include) {
      const includeStr = this.query.include as string;

      // Split by comma to handle multiple includes: "assignedTech,customer,device"
      const includeArr = includeStr.split(",").map((s) => s.trim());

      const includeObj: any = {};

      includeArr.forEach((relation) => {
        // Handle nested includes with dot notation: "assignedTech.user"
        if (relation.includes(".")) {
          const parts = relation.split(".");
          let current = includeObj;

          parts.forEach((part, index) => {
            if (index === parts.length - 1) {
              // Last part
              current[part] = true;
            } else {
              // Create nested structure
              if (!current[part]) {
                current[part] = { include: {} };
              }
              current = current[part].include;
            }
          });
        } else {
          // Simple include
          includeObj[relation] = true;
        }
      });

      this.options.include = includeObj;
    } else {
      delete this.options.include;
    }

    return this;
  }
}
