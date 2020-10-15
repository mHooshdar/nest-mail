import { Module } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { BoxesController } from './boxes.controller';
import { ImapModule } from 'src/imap/imap.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, ImapModule],
  providers: [BoxesService],
  controllers: [BoxesController],
})
export class BoxesModule {}
