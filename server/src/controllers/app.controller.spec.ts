import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { UsersService } from '../services/users.service';
import { AuthModule } from '../modules/auth.module';
import { UsersModule } from '../modules/users.module';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { MessageController } from './message.controller';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';

describe('AppController', () => {
  let appController: AppController;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV || 'test'}`,
        }),
        AuthModule,
        UsersModule,
      ],
      controllers: [AppController, UsersController, MessageController],
      providers: [MessageService],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    appController = moduleRef.get<AppController>(AppController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('[GET] /cities', () => {
    it('Should return an array of cities', async () => {
      const result = [
        {
          uuid: 'fake-id-1234',
          cidade: 'São Paulo',
        },
      ];
      jest
        .spyOn(usersService, 'getCities')
        .mockImplementation(async () => result);

      expect(await appController.cities()).toBe(result);
    });
  });

  describe('[POST] /auth/login', () => {
    it('Should return an access token', async () => {
      const result = {
        token: 'access-token',
      };
      jest.spyOn(authService, 'login').mockImplementation(async () => result);

      expect(
        await appController.login({ username: 'admin', password: 'admin' }),
      ).toBe(result);
    });
  });

  describe('[GET] /auth/user', () => {
    it('Should return an access token', async () => {
      const req = { user: {} };
      jest
        .spyOn(appController, 'user')
        .mockImplementation(async () => req.user);

      expect(await appController.user(req)).toBe(req.user);
    });
  });
});
