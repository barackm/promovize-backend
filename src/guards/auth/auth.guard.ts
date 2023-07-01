import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from 'src/modules/auth/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }
    const token = request.headers.authorization.split(' ')[1];
    const decodedToken = this.tokenService.validateToken(token);

    if (!decodedToken) {
      return false;
    }

    request.user = decodedToken;
    return true;
  }
}
