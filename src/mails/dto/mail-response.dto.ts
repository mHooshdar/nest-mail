import { EmailAddress, ParsedMail } from 'mailparser';

export class MailResponse {
  id: number;
  subject: ParsedMail['subject'];
  date: string;
  from: EmailAddress[];
  to: EmailAddress[];
}
