import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ItemEntity } from './item.entity';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity]),
    MediaModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule { }




