import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImapSimple } from 'imap-simple';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { GetMailsFilterDto } from './dto/get-mails-filter.dto';
import { MailDetailResponse } from './dto/mail-detail-response.dto';
import { MailResponse } from './dto/mail-response.dto';
import { SendMailDto } from './dto/send-mail.dto';
import { MailsService } from './mails.service';

@Controller('mails')
@UseGuards(AuthGuard())
export class MailsController {
  constructor(private mailsService: MailsService) {}

  @Get()
  // async getMails(@Query() filterDto: GetMailsFilterDto): Promise<Mail[]> {
  async getMails(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
    @GetUser() user: User,
  ): Promise<MailResponse[]> {
    const filterDto: GetMailsFilterDto = { offset, limit };
    return this.mailsService.getMails(filterDto, user);
  }

  @Get(':id')
  async getMail(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<MailDetailResponse | ImapSimple> {
    return this.mailsService.getMail(id, user);
  }

  @Delete(':id')
  async deleteMail(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.mailsService.deleteMail(id, user);
  }

  @Post()
  async sendEmail(
    @Body(ValidationPipe) sendMailDto: SendMailDto,
    @GetUser() user: User,
  ): Promise<void> {
    this.mailsService.sendEmail(sendMailDto, user);
  }
}
