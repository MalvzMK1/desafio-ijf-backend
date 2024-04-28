import { sign, verify } from "jsonwebtoken";
import { env } from "src/env";
import { UserRole } from "src/types/user-role";

export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
  userRole: UserRole;
}

export function createAccessToken(userId: string, userRole: UserRole) {
  return sign({ userRole }, env.JWT_ACCESS_TOKEN_SECRET, {
    subject: userId,
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  });
}

export function getTokenPayload(token: string) {
  return verify(token, env.JWT_ACCESS_TOKEN_SECRET) as TokenPayload;
}
