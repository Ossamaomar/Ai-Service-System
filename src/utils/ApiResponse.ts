export class ApiResponse {
  status: "success" | "fail" | "error";
  data?: any;
  token?: string;
  message?: string;
  results?: number;

  constructor({
    status,
    data,
    token,
    message,
    results,
  }: {
    status: "success" | "fail" | "error";
    data?: any;
    token?: string;
    message?: string;
    results?: number;
  }) {
    this.status = status;
    if (message) {
      this.message = message || "";
    }
    if (token) {
      this.token = token;
    }
    if (results) {
      this.results = results;
    }
    if (data) {
      this.data = data;
    }
  }
}
