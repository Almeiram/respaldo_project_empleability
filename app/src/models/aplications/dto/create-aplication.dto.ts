import {IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAplicationDto {
	@ApiProperty({ example: '1', description: 'User ID' })
	@IsNotEmpty()
	user_id: number;

	@ApiProperty({ example: '2', description: 'Vacancy ID' })
	@IsNotEmpty()
	vacancy_id: number;

	@ApiProperty({ example: '3', description: 'Applied ID' })
	@IsNotEmpty()
	applied_id: number;

}