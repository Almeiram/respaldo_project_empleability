import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(`[ApiKeyGuard] Checking public access for ${context.getClass().name}.${context.getHandler().name}: ${isPublic}`);

    if (isPublic) {
      console.log('[ApiKeyGuard] Public access granted');
      return true;
    }

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] || request.headers['X-API-KEY'];
    const expected = process.env.API_KEY || '';
    if (!expected) return true; // If not configured, allow (dev)
    if (!apiKey || apiKey !== expected) {
      throw new UnauthorizedException('Invalid API Key');
    }
    return true;
  }
}
