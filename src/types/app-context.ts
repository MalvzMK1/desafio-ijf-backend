import type { Request, Response } from "express";
import { User } from "src/graphql/entities/user";
import { UserRole } from "./user-role";

export type ContextUser = Omit<User, "password"> & { role: UserRole };

export interface AppContext {
  request: Request;
  response: Response;
  user?: ContextUser | null;
}

export interface AppContextWithUser extends Omit<AppContext, "user"> {
  user: ContextUser;
}
