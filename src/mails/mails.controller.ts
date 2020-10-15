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
import { MoveMessageDto } from './dto/move-message.dto';
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
    @Query('box') box: string,
    @GetUser() user: User,
  ): Promise<MailResponse[]> {
    const filterDto: GetMailsFilterDto = { offset, limit, box };
    return this.mailsService.getMails(filterDto, user);
  }

  @Get(':id')
  async getMail(
    @Param('id', ParseIntPipe) id: number,
    @Query('box') box: string,
    @GetUser() user: User,
  ): Promise<MailDetailResponse | ImapSimple> {
    return this.mailsService.getMail(id, box, user);
  }

  @Delete(':id')
  async deleteMail(
    @Param('id', ParseIntPipe) id: number,
    @Query('box') box: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.mailsService.deleteMail(id, box, user);
  }

  @Post()
  async sendEmail(
    @Body(ValidationPipe) sendMailDto: SendMailDto,
    @GetUser() user: User,
  ): Promise<void> {
    this.mailsService.sendEmail(sendMailDto, user);
  }

  @Post('move/:id')
  async moveMessage(
    @Param('id') mailId: string,
    @Body(ValidationPipe) moveMessageDto: MoveMessageDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.mailsService.moveMessage(mailId, moveMessageDto, user);
  }
}
