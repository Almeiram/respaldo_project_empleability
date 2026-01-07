import {IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAplicationDto {
	@ApiProperty({ example: '123456789', description: 'User ID' })
	@IsNotEmpty()
	user_id: number;

	@ApiProperty({ example: '123456789', description: 'Vacancy ID' })
	@IsNotEmpty()
	vacancy_id: number;

	@ApiProperty({ example: '123456789', description: 'Applied ID' })
	@IsNotEmpty()
	applied_id: number;

}