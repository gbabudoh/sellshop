export function generatePin(length: number = 6): string {
  return Math.random()
    .toString()
    .substring(2, 2 + length)
    .padEnd(length, "0");
}

export function generateToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
