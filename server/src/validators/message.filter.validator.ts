import { IsOptional } from 'class-validator';

export default class MessageFilterValidator {
  @IsOptional()
  titulo: string;
  @IsOptional()
  conteudo: string;
  @IsOptional()
  exactMatch: 'true';
}
