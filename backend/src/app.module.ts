import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { MailService } from './mail.service'; // <-- Import your new MailService

@Module({
  imports: [
    // 1. Load your .env variables securely
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. API Rate Limiting (Protects from spam)
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 50,
    }]),

    // 3. Your MongoDB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    TasksModule,
  ],
  providers: [
    MailService, // <-- Register MailService here so it can be injected
    // Turn on the Rate Limiter globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}