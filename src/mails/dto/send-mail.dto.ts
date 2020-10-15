import { IsOptional, IsString } from 'class-validator';
import { Attachment } from 'nodemailer/lib/mailer';

export class SendMailDto {
  @IsString()
  subject: string;

  @IsString()
  // comma seperated
  to: string;

  @IsString()
  html: string;

  @IsOptional()
  @IsString()
  // comma seperated
  cc: string;

  @IsOptional()
  attachments: Attachment[];
}
