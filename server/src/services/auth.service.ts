import { Injectable } from '@nestjs/common';
import { LowdbService } from './lowdb.service';
import { JwtService } from '@nestjs/jwt';
import { Record } from '../types/record.type';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private lowdbService: LowdbService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(
    username: string,
    password: string,
  ): Promise<null | Record> {
    const user = await this.lowdbService.findOne('users', async (row) => {
      return (
        row.value.nickname === username &&
        (await compare(password, row.value.senha))
      );
    });
    if (!user) return;
    return user;
  }

  async login(user: Record) {
    const payload = {
      id: user.uuid,
      ...user.value,
      senha: undefined,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
