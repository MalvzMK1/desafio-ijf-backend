import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { AppContext, ContextUser } from "src/types/app-context";
import { UserRole } from "src/types/user-role";

@Injectable()
export class AuthGuard implements CanActivate {
  #jwtService = new JwtService();

  constructor(
    private allowedRoles?: UserRole[],
    private errorMessage?: string,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext<AppContext>();
    const authorizationHeader = ctx.request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return false;
    }

    const token = authorizationHeader.slice(7);
    try {
      const decoded = this.#jwtService.verify<ContextUser>(token);

      if (this.allowedRoles && !this.allowedRoles.includes(decoded.role)) {
        throw new ForbiddenException(this.errorMessage);
      }

      ctx.user = decoded;
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
    }

    throw new UnauthorizedException();
  }
}

export function UseAuthGuard(
  allowedRoles?: UserRole[],
  errorMessage?: string,
): ReturnType<typeof UseGuards> {
  return UseGuards(new AuthGuard(allowedRoles, errorMessage));
}
