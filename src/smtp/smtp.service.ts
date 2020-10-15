import { Injectable, UnauthorizedException } from '@nestjs/common';
import nodemailer = require('nodemailer');
import config = require('config');
import { AuthCredentialsDto } from 'src/auth/dto/auth-credential.dto';
import Mail = require('nodemailer/lib/mailer');

const smtpConfig = config.get('smtp');

@Injectable()
export class SmtpService {
  async createConnection(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<Mail> {
    const { username: user, password: pass } = authCredentialsDto;

    try {
      const smtpTransporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: false, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });
      return smtpTransporter;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
