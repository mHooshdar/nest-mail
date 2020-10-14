import _find = require('lodash/find');
import { Injectable } from '@nestjs/common';
import { ParsedMail, simpleParser } from 'mailparser';
import { User } from 'src/auth/user.entity';
import { ImapService } from 'src/imap/imap.service';
import { GetMailsFilterDto } from './dto/get-mails-filter.dto';
import { MailResponse } from './dto/mail-response.dto';

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
    const searchCriteria = [`${offset}:${offset + limit - 1}`, 'ALL'];
    
    const fetchOptions = { bodies: ['HEADER', 'TEXT', ''] };
    const messages = await imapConnection.search(searchCriteria, fetchOptions);
    const mails = await Promise.all(
      messages.map(async item => {
        const all = _find(item.parts, { which: '' });
        const id = item.attributes.uid;
        const idHeader = `Imap-Id: ${id}\r\n`;
        const mail: ParsedMail = await simpleParser(idHeader + all.body);
        const resultMail: MailResponse = {
          subject: mail.subject,
          html: mail.html,
          from: mail.from.value,
          to: mail.to.value,
        };
        return resultMail;
      }),
    );
    return mails;
  }
}
