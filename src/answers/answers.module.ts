import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { AnswerEntity } from './answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerEntity])],
  providers: [AnswersService],
  controllers: [AnswersController],
  exports: [AnswersService],
})
export class AnswersModule {}
