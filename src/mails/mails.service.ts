import { MessageBodyPart, Message } from 'imap-simple';
import { simpleParser } from 'mailparser';
import _find = require('lodash/find');
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { ImapService } from 'src/imap/imap.service';
import { GetMailsFilterDto } from './dto/get-mails-filter.dto';
import { MailResponse } from './dto/mail-response.dto';
import { generateEmailObject } from './utils';
import { MailDetailResponse } from './dto/mail-detail-response.dto';

@Injectable()
export class MailsService {
  constructor(private imapService: ImapService) {}

  async getMails(
    filterDto: GetMailsFilterDto,
    user: User,
  ): Promise<MailResponse[]> {
    const { offset = 1, limit = 10 } = filterDto;
    const imapConnection = await this.imapService.createConnection(user);
    await imapConnection.openBox('INBOX');

    // $ Starts at 1 not Zero
    const searchCriteria = [`${offset}:${offset + limit - 1}`];

    const fetchOptions = { bodies: ['HEADER'] };

    const messages: Message[] = await imapConnection.search(
      searchCriteria,
      fetchOptions,
    );
    const mails = await Promise.all(
      messages.map(async item => {
        const { body }: MessageBodyPart = _find(item.parts, {
          which: 'HEADER',
        });
        const id = item.attributes.uid;
        const from = generateEmailObject(body.from[0]);
        const to = generateEmailObject(body.to[0]);

        const resultMail: MailResponse = {
          id,
          subject: body.subject[0],
          date: body.date[0],
          from,
          to,
          seen: item.attributes.flags.includes('\\Seen'),
        };
        return resultMail;
      }),
    );
    imapConnection.end();
    return mails;
  }

  async getMail(id: number, user: User): Promise<MailDetailResponse> {
    const imapConnection = await this.imapService.createConnection(user);

    await imapConnection.openBox('INBOX');

    const searchCriteria = [['UID', `${id}`]];
    const fetchOptions = { bodies: [''], markSeen: true };

    const messages = await imapConnection.search(searchCriteria, fetchOptions);
    const response = await Promise.all(
      messages.map(async item => {
        const all = _find(item.parts, { which: '' });
        const id = item.attributes.uid;
        const idHeader = `Imap-Id: ${id}\r\n`;
        const mail = await simpleParser(idHeader + all.body);
        const result: MailDetailResponse = {
          id,
          subject: mail.subject,
          html: mail.html,
          date: mail.date,
          from: mail.from.value,
          to: mail.to.value,
          cc: mail.cc ? mail.cc.value : [],
        };
        return result;
      }),
    );
    imapConnection.end();
    return response[0];
  }
}
