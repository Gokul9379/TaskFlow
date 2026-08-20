import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; // <-- Import Throttler
import { APP_GUARD } from '@nestjs/core'; // <-- Import APP_GUARD

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // 1. Load your .env variables securely
    ConfigModule.forRoot({ isGlobal: true }),

    // --- 2. NEW: API Rate Limiting (Protects from spam) ---
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 50,
    }]),
    // ------------------------------------------------------

    // 3. Your original, working MongoDB connection!
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    // 4. Your original, working Email configuration!
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: config.get('EMAIL_USER'),
            pass: config.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"Task Master" <${config.get('EMAIL_USER')}>`,
        },
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    TasksModule,
  ],
  providers: [
    // --- 5. NEW: Turn on the Rate Limiter globally ---
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}