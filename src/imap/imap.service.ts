import { Injectable, UnauthorizedException } from '@nestjs/common';
import config = require('config');
import { AuthCredentialsDto } from 'src/auth/dto/auth-credential.dto';
import imaps = require('imap-simple');
import { ImapSimpleOptions, ImapSimple } from 'imap-simple';

const imapConfig = config.get('imap');

@Injectable()
export class ImapService {
  async createConnection(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<ImapSimple> {
    const { username: user, password } = authCredentialsDto;

    try {
      const imapSimpleOption: ImapSimpleOptions = {
        imap: {
          user,
          password,
          host: imapConfig.host,
          port: imapConfig.port,
          tls: true,
        },
      };
      return await imaps.connect(imapSimpleOption);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
