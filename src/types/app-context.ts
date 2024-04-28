import type { Request, Response } from "express";
import { User } from "src/graphql/entities/user";

export type ContextUser = Omit<User, "password">;

export interface AppContext {
  request: Request;
  response: Response;
  user?: ContextUser | null;
}

export interface AppContextWithUser extends Omit<AppContext, "user"> {
  user: ContextUser;
}
