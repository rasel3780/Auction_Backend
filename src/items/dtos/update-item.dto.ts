import { PartialType } from '@nestjs/swagger';
import { createItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(createItemDto) { }