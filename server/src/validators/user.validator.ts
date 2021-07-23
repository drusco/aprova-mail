import { IsNotEmpty, IsString, Matches } from 'class-validator';

const username = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{2,32}$/im;

export default class UserValidator {
  @IsNotEmpty({ message: 'nome:Nome não poder estar vazio' })
  nome: string;

  @IsNotEmpty({ message: 'nickname:Nickname não poder estar vazio' })
  @Matches(username, {
    message: 'nickname-Nickname deve ter entre 2 e 32 caracteres (a-z0-9._)',
  })
  nickname: string;

  @IsNotEmpty({ message: 'cidade:Cidade deve ser preenchido' })
  cidade: string;

  @IsNotEmpty({ message: 'senha:Senha deve ser preenchido' })
  senha: string;
}
