import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
          tls: {
            rejectUnauthorized: false,
          },
          // Add timeout settings to prevent connection timeouts
          connectionTimeout: 60000, // 60 seconds
          greetingTimeout: 30000, // 30 seconds
          socketTimeout: 60000, // 60 seconds
        },
        defaults: {
          from: `"ElimuHub Customer Service" <${configService.get<string>('MAIL_USER')}>`,
        },
        template: {
          dir: join(process.cwd(), 'src', 'mailer', 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class AppMailerModule {}
