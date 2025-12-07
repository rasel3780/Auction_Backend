import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
import { BidsModule } from './bids/bids.module';
import { AnswersModule } from './answers/answers.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '123456',
      database: 'auction_db',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    ItemsModule,
    AuthModule,
    BidsModule,
    AnswersModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
