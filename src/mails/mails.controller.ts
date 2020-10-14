import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { GetMailsFilterDto } from './dto/get-mails-filter.dto';
import { MailsService } from './mails.service';

@Controller('mails')
@UseGuards(AuthGuard())
export class MailsController {
  constructor(private mailsService: MailsService) {}

  @Get()
  // getMails(@Query() filterDto: GetMailsFilterDto): Promise<Mail[]> {
  getMails(@Query() filterDto: GetMailsFilterDto, @GetUser() user) {
    return this.mailsService.getMails(filterDto, user);
  }
}
