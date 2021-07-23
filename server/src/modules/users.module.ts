import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { LowdbService } from '../services/lowdb.service';

@Module({
  providers: [LowdbService, UsersService],
  exports: [LowdbService, UsersService],
})
export class UsersModule {}
