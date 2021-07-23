import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Header,
} from '@nestjs/common';
import { LocalGuard } from '../auth/local.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { AuthService } from '../services/auth.service';
import { LowdbService } from '../services/lowdb.service';
import { UsersService } from '../services/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private lowdbService: LowdbService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtGuard)
  @Get('auth/user')
  user(@Request() req) {
    return req.user;
  }

  @Get('cities')
  async cities() {
    return await this.usersService.getCities();
  }
}
