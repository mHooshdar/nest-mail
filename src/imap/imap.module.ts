import { Global, Module } from '@nestjs/common';
import { ImapService } from './imap.service';

@Global()
@Module({
  providers: [ImapService],
  exports: [ImapService],
})
export class ImapModule {}
