import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export type Modality = 'remoto' | 'hibrido' | 'presencial';

export class CreateVacancyDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	description: string;

	@IsOptional()
	@IsString()
	technologies?: string;

	@IsOptional()
	@IsString()
	seniority?: string;

	@IsOptional()
	@IsString()
	softSkills?: string;

	@IsNotEmpty()
	@IsString()
	location: string;

	@IsEnum(['remoto', 'hibrido', 'presencial'])
	modality: Modality;

	@IsOptional()
	@IsString()
	salaryRange?: string;

	@IsNotEmpty()
	@IsString()
	company: string;

	@IsInt()
	@Min(1)
	maxApplicants: number;
}
