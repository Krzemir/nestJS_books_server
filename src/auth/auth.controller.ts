import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/register')
  create(@Body() userData: RegisterDto) {
    return this.authService.register(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res): Promise<void> {
    const tokens = await this.authService.createSession(req.user);
    res.cookie('auth', tokens, { httpOnly: true });
    res.send({
      message: 'success',
    });
  }
}
