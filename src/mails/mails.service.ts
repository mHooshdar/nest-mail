import { MessageBodyPart } from 'imap-simple';
import _find = require('lodash/find');
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { ImapService } from 'src/imap/imap.service';
import { GetMailsFilterDto } from './dto/get-mails-filter.dto';
import { MailResponse } from './dto/mail-response.dto';
import { EmailAddress } from 'mailparser';

function generateEmailObject (sender: string): EmailAddress {
  const splitedSender = sender.split('<');
  let name = '';
  let address = '';

  if (splitedSender.length === 1) {
    address = splitedSender[0].slice(0, -1);
  } else {
    console.log(splitedSender[0]);
    
    const tempName = splitedSender[0].replace(/"/g, '').slice(0, -1);
    address = splitedSender[1].slice(0, -1);
    if (tempName && tempName !== address) {
      name = tempName;
    }
  }

  return {
    name,
    address,
  };
};

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

    const fetchOptions = { bodies: ['HEADER'] };
    const messages = await imapConnection.search(searchCriteria, fetchOptions);
    const mails = await Promise.all(
      messages.map(async item => {
        const { body }: MessageBodyPart = _find(item.parts, {
          which: 'HEADER',
        });
        const id = item.attributes.uid;
        const from = body.from.map(from => generateEmailObject(from))
        const to = body.to.map(to => generateEmailObject(to))

        const resultMail: MailResponse = {
          id,
          subject: body.subject[0],
          date: body.date[0],
          from,
          to
        };
        return resultMail;
      }),
    );
    return mails;
  }
}
