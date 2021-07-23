import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import UserValidator from '../validators/user.validator';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('/citizens')
  async citizens(@Request() req) {
    return await this.usersService.getCitizensByUserId(req.user.id);
  }

  @Post()
  async createNewUser(@Body() user: UserValidator) {
    return await this.usersService.add(user).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}
