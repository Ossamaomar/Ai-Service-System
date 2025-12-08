import jwt from "jsonwebtoken";

export function signToken(id: string) {
  console.log(process.env.JWT_EXPIRES_IN);
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: `${Number(process.env.JWT_EXPIRES_IN)}H`,
  });
}

export function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, process.env.JWT_SECRET) as { id: string };
}

export function generateTicketNumber(prefix = "SG") {
  const year = new Date().getFullYear();

  // Use a random auto-increment style number padded to 4 digits
  const seq = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");

  return `${prefix}-${year}-${seq}`;
}

export function generateDeviceCode(prefix = "SJ") {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";

  for (let i = 0; i < 11; i++) {
    randomPart += charset[Math.floor(Math.random() * charset.length)];
  }

  return `${prefix}-${randomPart}`;
}


