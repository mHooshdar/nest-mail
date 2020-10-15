import { EmailAddress, ParsedMail } from 'mailparser';
import { MailResponse } from './mail-response.dto';

export class MailDetailResponse extends MailResponse {
  html: ParsedMail['html'];
}
