import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ParsedMail } from 'mailparser';
import { GetUser } from 'src/auth/get-user.decorator';
import { GetMailsFilterDto } from './dto/get-mails-filter.dto';
import { MailDetailResponse } from './dto/mail-detail-response.dto';
import { MailResponse } from './dto/mail-response.dto';
import { MailsService } from './mails.service';

@Controller('mails')
@UseGuards(AuthGuard())
export class MailsController {
  constructor(private mailsService: MailsService) {}

  @Get()
  // getMails(@Query() filterDto: GetMailsFilterDto): Promise<Mail[]> {
  getMails(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
    @GetUser() user,
  ): Promise<MailResponse[]> {
    const filterDto: GetMailsFilterDto = { offset, limit };
    return this.mailsService.getMails(filterDto, user);
  }

  @Get(':id')
  getMail(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user,
  ): Promise<MailDetailResponse> {
    return this.mailsService.getMail(id, user);
  }

  @Delete(':id')
  deleteMail(@Param('id', ParseIntPipe) id: number, @GetUser() user) {
    return this.mailsService.deleteMail(id, user);
  }
}
