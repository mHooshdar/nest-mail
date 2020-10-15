import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const envConfig = ConfigModule.forRoot({
  isGlobal: true,
});

import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MailsModule } from './mails/mails.module';

@Module({
  imports: [
    envConfig,
    TypeOrmModule.forRoot(typeOrmConfig),
    MailsModule,
    AuthModule,
  ],
})
export class AppModule {}
