import { PartialType } from '@nestjs/mapped-types';
import { CreateAplicationDto } from './create-aplication.dto';

export class UpdateAplicationDto extends PartialType(CreateAplicationDto) {}
