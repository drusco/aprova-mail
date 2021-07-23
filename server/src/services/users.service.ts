import { Injectable } from '@nestjs/common';
import { User } from '../types/user.type';
import { RecordFilter } from '../types/record.filter.type';
import { LowdbService } from './lowdb.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly lowdbService: LowdbService) {}

  public async add(user: User): Promise<any> {
    const taken = await this.lowdbService.findOne(
      'users',
      (row) => row.value.nickname === user.nickname,
    );
    if (taken) throw Error('nickname:Nickname já existe');
    const city = await this.lowdbService.findById('cities', user.cidade);
    if (!city) throw Error('cidade:Cidade é inválida');
    const uuid = await this.lowdbService.add('users', {
      ...user,
      senha: await hash(user.senha, 10),
    });
    if (!uuid) throw Error('user:Não foi possivel cadatrar usuario');
    return uuid;
  }

  public async find(
    filters: undefined | RecordFilter = undefined,
  ): Promise<any> {
    return await this.lowdbService.find('users', filters);
  }

  public async getCitizensByUserId(uuid: string): Promise<any> {
    const user = await this.getUserById(uuid);
    const users = await this.find(
      (row) =>
        row.uuid !== user?.uuid && row.value.cidade === user?.value.cidade,
    );
    return users.map((user) => ({
      id: user.uuid,
      ...user.value,
      senha: undefined,
      cidade: undefined,
    }));
  }

  public async getCities() {
    return (await this.lowdbService.find('cities')).map((city) => ({
      uuid: city.uuid,
      cidade: city.value,
    }));
  }

  public async getUserById(uuid: string): Promise<any> {
    return await this.lowdbService.findById('users', uuid);
  }
}
