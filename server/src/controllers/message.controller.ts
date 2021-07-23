import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import MessageValidator from '../validators/message.validator';
import MessageFilterValidator from '../validators/message.filter.validator';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/inbox')
  @UseGuards(JwtGuard)
  inbox(@Query() filters: MessageFilterValidator, @Request() req) {
    return this.messageService.getByUserId(req.user.id, filters);
  }

  @Get('/sent')
  @UseGuards(JwtGuard)
  sent(@Query() filters: MessageFilterValidator, @Request() req) {
    return this.messageService.getByUserId(req.user.id, filters, 'sent');
  }

  @Get('/view/:id')
  @UseGuards(JwtGuard)
  view(@Param('id') id: string, @Request() req) {
    return this.messageService
      .viewMessageByUser(id, req.user.id)
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() message: MessageValidator, @Request() req) {
    return await this.messageService
      .create({
        ...message,
        read: false,
        remetente: req.user.id,
      })
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }
}
