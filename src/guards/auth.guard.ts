import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  UseGuards,
  Logger,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { AppContext, ContextUser } from "src/types/app-context";
import { UserRole } from "src/types/user-role";
import { getUserFromHeaders } from "src/utils/get-user-from-headers";
import { getTokenPayload } from "src/utils/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  #jwtService = new JwtService();

  constructor(
    private allowedRoles?: UserRole[],
    private errorMessage?: string,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext<AppContext>();

    try {
      const user = await getUserFromHeaders(ctx.request.headers);

      ctx.user = user;

      return true;
    } catch (err) {
      Logger.error(err);
    }

    return false;
  }
}

export function UseAuthGuard(
  allowedRoles?: UserRole[],
  errorMessage?: string,
): ReturnType<typeof UseGuards> {
  return UseGuards(new AuthGuard(allowedRoles, errorMessage));
}
