import jwt from "jsonwebtoken";

const JWT_SECRET = process.env["JWT_SECRET"] ?? "buildmatch-dev-secret-change-in-production";
const JWT_EXPIRES_IN = "30d";

export type JwtPayload = {
  userId: string;
  phone: string;
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
      return decoded as JwtPayload;
    }
    return null;
  } catch {
    return null;
  }
}
