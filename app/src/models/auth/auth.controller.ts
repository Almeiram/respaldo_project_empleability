import { Controller, Post, Body, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/register-auth.dto';
import { AuthLoginDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

class AuthResponseDto {
  user: User;
  access_token: string;
  expires_in: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered and token returned', type: AuthResponseDto })
  async register(@Body() dto: AuthRegisterDto) {
    const user = await this.authService.register(dto);
    const token = await this.authService.login(user);
    return { user, ...token };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and receive access token' })
  @ApiResponse({ status: 200, description: 'User logged in', type: AuthResponseDto })
  async login(@Body() dto: AuthLoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }
}
