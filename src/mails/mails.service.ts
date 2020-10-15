import { MessageBodyPart, Message, ImapSimple } from 'imap-simple';
import { simpleParser } from 'mailparser';
import Mail = require('nodemailer/lib/mailer');
import _find = require('lodash/find');
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { ImapService } from 'src/imap/imap.service';
import { GetMailsFilterDto } from './dto/get-mails-filter.dto';
import { MailResponse } from './dto/mail-response.dto';
import { generateEmailAddress, generateEmailObject } from './utils';
import { MailDetailResponse } from './dto/mail-detail-response.dto';
import { SmtpService } from 'src/smtp/smtp.service';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailsService {
  constructor(
    private imapService: ImapService,
    private smtpService: SmtpService,
  ) {}

  async getMails(
    filterDto: GetMailsFilterDto,
    user: User,
  ): Promise<MailResponse[]> {
    const { offset = 1, limit = 10 } = filterDto;
    const imapConnection: ImapSimple = await this.imapService.createConnection(
      user,
    );
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
          cc: body.cc ? generateEmailAddress(body.cc[0]) : [],
          seen: item.attributes.flags.includes('\\Seen'),
        };
        return resultMail;
      }),
    );
    imapConnection.end();
    return mails;
  }

  async getMail(
    id: number,
    user: User,
    returnConnection?: boolean,
  ): Promise<MailDetailResponse | ImapSimple> {
    const imapConnection: ImapSimple = await this.imapService.createConnection(
      user,
    );
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
          seen: true,
        };
        return result;
      }),
    );

    if (!response.length) {
      throw new NotFoundException();
    }

    if (returnConnection) {
      return imapConnection;
    }

    imapConnection.end();
    return response[0];
  }

  async deleteMail(id: number, user: User): Promise<void> {
    const imapConnection: any = await this.getMail(id, user, true);
    await imapConnection.deleteMessage(id);
    imapConnection.end();
  }

  async sendEmail(sendMailDto: SendMailDto, user: User): Promise<void> {
    const smtpTransporter = await this.smtpService.createConnection(user);
    const { subject, html, to, cc = [], attachments = [] } = sendMailDto;

    const { username } = user;
    const mailOptions: Mail.Options = {
      from: `<${username}@aut.ac.ir>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
      cc,
      attachments,
    };
    await smtpTransporter.sendMail(mailOptions);
  }
}
