import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { AppController } from '../controllers/app.controller';
import { UsersController } from '../controllers/users.controller';
import { MessageController } from '../controllers/message.controller';
import { MessageService } from '../services/message.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController, MessageController],
  providers: [MessageService],
})
export class AppModule {}
