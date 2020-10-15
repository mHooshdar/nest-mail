import { EmailAddress, ParsedMail } from 'mailparser';

export class MailResponse {
  id: number;
  subject: ParsedMail['subject'];
  date: ParsedMail['date'];
  from: EmailAddress[];
  to: EmailAddress[];
  cc: EmailAddress[]
  seen: boolean;
}
