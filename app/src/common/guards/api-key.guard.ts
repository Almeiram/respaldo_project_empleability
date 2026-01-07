import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
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
