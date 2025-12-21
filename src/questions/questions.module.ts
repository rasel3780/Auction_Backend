import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionEntity } from './question.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionEntity]),
    AuthModule,
  ],
  providers: [QuestionsService, JwtAuthGuard],
  controllers: [QuestionsController],
  exports: [QuestionsService],
})
export class QuestionsModule { }
