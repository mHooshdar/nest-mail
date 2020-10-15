import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SmtpModule } from 'src/smtp/smtp.module';
import { ImapModule } from 'src/imap/imap.module';

@Module({
  imports: [AuthModule, SmtpModule, ImapModule],
  providers: [MailsService],
  controllers: [MailsController],
})
export class MailsModule {}
