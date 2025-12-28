import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionModule } from 'src/auctions/auction.module';
import { AnswersModule } from './answers/answers.module';
import { AuthModule } from './auth/auth.module';
import { BidsModule } from './bids/bids.module';
import { ItemCategoryModule } from './item-category/item-category.module';
import { ItemsModule } from './items/items.module';
import { MediaModule } from './media/media.module';
import { QuestionsModule } from './questions/questions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'rasel',
      password: '123456',
      database: 'auction_Db',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASS,
        },
      },
      defaults: {
        from: '"Auction Platform" <no-reply@auction.com>',
      },
    }),
    UsersModule,
    ItemsModule,
    BidsModule,
    QuestionsModule,
    AnswersModule,
    AuthModule,
    MediaModule,
    ItemCategoryModule,
    AuctionModule,
  ],
})
export class AppModule { }
