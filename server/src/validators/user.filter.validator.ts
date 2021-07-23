import { IsOptional } from 'class-validator';

export default class UserFilterValidator {
  @IsOptional()
  nome: string;
  @IsOptional()
  nickname: string;
  @IsOptional()
  cidade: string;
}
