import { sign, verify } from "jsonwebtoken";
import { env } from "src/env";

export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export function createAccessToken(userId: string) {
  return sign({}, env.JWT_ACCESS_TOKEN_SECRET, {
    subject: userId,
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  });
}

export function getTokenPayload(token: string) {
  return verify(token, env.JWT_ACCESS_TOKEN_SECRET) as TokenPayload;
}
