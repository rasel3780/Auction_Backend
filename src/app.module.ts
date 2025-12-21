import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { BidsModule } from './bids/bids.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { ItemCategoryModule } from './item-category/item-category.module';

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
    UsersModule,
    ItemsModule,
    BidsModule,
    QuestionsModule,
    AnswersModule,
    AuthModule,
    MediaModule,
    ItemCategoryModule,
  ],
})
export class AppModule { }
