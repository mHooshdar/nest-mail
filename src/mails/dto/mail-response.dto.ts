import { EmailAddress, ParsedMail } from 'mailparser';

export class MailResponse {
  subject: ParsedMail['subject'];
  html: ParsedMail['html'];
  from: EmailAddress[];
  to: EmailAddress[];
}
