import slugify from 'slugify';
import { Injectable } from '@nestjs/common';
import { Message } from '../types/message.type';
import { LowdbService } from './lowdb.service';
import { ConfigService } from '@nestjs/config';
import MessageFilterValidator from '../validators/message.filter.validator';

@Injectable()
export class MessageService {
  private readonly slugifyOptions;
  constructor(
    private readonly lowdbService: LowdbService,
    private readonly configService: ConfigService,
  ) {
    this.slugifyOptions = {
      lower: true,
      locale: this.configService.get('LOCALE') || 'pt',
    };
  }

  public async create(message: Message): Promise<any> {
    const remetente = await this.lowdbService.findOne(
      'users',
      (row) => row.uuid === message.remetente,
    );
    if (!remetente) throw Error('remetente:Remetente é inválido');
    const destinatario = await this.lowdbService.findOne(
      'users',
      (row) =>
        row.value.nickname === message.destinatario &&
        row.value.cidade === remetente.value.cidade,
    );
    if (!destinatario) throw Error('destinatario:Destinatário é inválido');
    return await this.lowdbService.add('messages', {
      ...message,
      destinatario: destinatario.uuid,
    });
  }

  public async getByUserId(
    uuid: string,
    filters: MessageFilterValidator,
    status: 'sent' | 'inbox' = 'inbox',
  ): Promise<any> {
    const slugifyOptions = this.slugifyOptions;
    return (
      await this.lowdbService.find('messages', async (message) => {
        const property = status === 'inbox' ? 'destinatario' : 'remetente';
        const matchStatus = message.value[property] === uuid;
        if (Object.keys(filters).length && matchStatus) {
          const exactMatch = filters.exactMatch === 'true';
          const titulo = slugify(message.value.titulo || '', slugifyOptions);
          const conteudo = slugify(
            message.value.conteudo || '',
            slugifyOptions,
          );
          const filterTituloSlug = slugify(
            filters.titulo || '',
            slugifyOptions,
          );
          const filterConteudoSlug = slugify(
            filters.conteudo || '',
            slugifyOptions,
          );
          if (exactMatch) {
            if (filters.titulo && titulo !== filterTituloSlug) return false;
            else if (filters.conteudo && conteudo !== filterConteudoSlug)
              return false;
          } else {
            if (filters.titulo && !titulo.includes(filterTituloSlug))
              return false;
            else if (filters.conteudo && !conteudo.includes(filterConteudoSlug))
              return false;
          }
        }
        return matchStatus;
      })
    )
      .map((message) => ({
        id: message.uuid,
        ...message.value,
        titulo:
          message.value.titulo.length > 50
            ? message.value.titulo.substring(0, 50) + '...'
            : message.value.titulo,
        conteudo:
          message.value.conteudo.length > 50
            ? message.value.conteudo.substring(0, 50) + '...'
            : message.value.conteudo,
        date: message.created,
      }))
      .reverse();
  }

  public async viewMessageByUser(
    messageId: string,
    userId: string,
  ): Promise<any> {
    const destinatario = await this.lowdbService.findOne(
      'users',
      (row) => row.uuid === userId,
    );
    if (!destinatario) throw Error('destinatario:Destinatário não é válido');
    const mensagem = await this.lowdbService.findOne(
      'messages',
      (row) => row.uuid === messageId,
    );
    if (!mensagem) throw Error('conteudo:Mensagem não é válido');
    if (
      !(
        mensagem.value.destinatario === userId ||
        mensagem.value.remetente === userId
      )
    )
      throw Error('destinatario:A mensagem não corresponde ao destinatário');
    if (!mensagem.value.read && mensagem.value.destinatario === userId) {
      await this.lowdbService.update('messages', messageId, {
        ...mensagem.value,
        read: true,
      });
    }
    return {
      id: messageId,
      ...mensagem.value,
      date: mensagem.created,
      read: undefined,
    };
  }
}
