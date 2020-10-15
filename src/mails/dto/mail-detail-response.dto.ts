import { EmailAddress, ParsedMail } from 'mailparser';

export class MailDetailResponse {
  id: number;
  subject: string;
  html: ParsedMail['html'];
  date: ParsedMail['date'];
  from: EmailAddress[];
  to: EmailAddress[];
  cc: EmailAddress[];
}
