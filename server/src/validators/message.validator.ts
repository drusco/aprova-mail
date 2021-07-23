import { IsNotEmpty } from 'class-validator';

export default class MessageValidator {
  @IsNotEmpty({ message: 'titulo:Título deve estar preenchido' })
  titulo: string;
  @IsNotEmpty({ message: 'conteudo:Mensagem deve estar preenchido' })
  conteudo: string;
  @IsNotEmpty({ message: 'destinatario:Destinatário deve estar preenchido' })
  destinatario: string;
}
