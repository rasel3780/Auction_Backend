import { PartialType } from '@nestjs/swagger';
import { CreteQuesDto } from './create-question.dto';
export class UpdateQuesDto extends PartialType(CreteQuesDto) { }
