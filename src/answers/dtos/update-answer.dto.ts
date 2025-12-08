import { PartialType } from '@nestjs/swagger';
import { CreateAnsDto } from './create-answer.dto';


export class UpdateAnsDto extends PartialType(CreateAnsDto) { }