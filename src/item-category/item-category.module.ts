import { Module } from '@nestjs/common';
import { ItemCategoryController } from './item-category.controller';
import { ItemCategoryService } from './item-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCategoryEntity } from './ItemCategoryEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemCategoryEntity]),
  ],
  controllers: [ItemCategoryController],
  providers: [ItemCategoryService],
  exports: [ItemCategoryService]
})
export class ItemCategoryModule { }
