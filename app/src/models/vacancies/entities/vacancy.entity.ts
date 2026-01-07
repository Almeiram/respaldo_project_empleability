import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Aplication } from '../../aplications/entities/aplication.entity';

export type Modality = 'remoto' | 'hibrido' | 'presencial';

@Entity()
export class Vacancy {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Auto-generated vacancy id' })
    id: number;

    @Column()
    @ApiProperty({ example: 'Fullstack Developer', description: 'Vacancy title' })
    title: string;

    @Column('text')
    @ApiProperty({ example: 'We are looking for a fullstack developer...', description: 'Detailed description' })
    description: string;

    @Column()
    @ApiProperty({ example: 'Node.js, TypeScript, PostgreSQL', description: 'Comma separated technologies' })
    technologies: string;

    @Column()
    @ApiProperty({ example: 'Senior', description: 'Seniority level' })
    seniority: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'Communication, Teamwork', description: 'Soft skills', required: false })
    softSkills: string;

    @Column()
    @ApiProperty({ example: 'Medellin, Colombia', description: 'Location' })
    location: string;

    @Column()
    @ApiProperty({ example: 'remoto', enum: ['remoto','hibrido','presencial'], description: 'Work modality' })
    modality: Modality;

    @Column({ nullable: true })
    @ApiProperty({ example: '$2000-$3000', description: 'Salary range', required: false })
    salaryRange: string;

    @Column()
    @ApiProperty({ example: 'Acme Corp', description: 'Company name' })
    company: string;

    @Column({ type: 'int' })
    @ApiProperty({ example: 10, description: 'Maximum number of allowed applicants' })
    maxApplicants: number;

    @Column()
    @ApiProperty({ example: 1, description: 'User id who created the vacancy' })
    user_id: number;

    @Column()
    @ApiProperty({ example: 123, description: 'External vacancy identifier (if any)' })
    vacancy_id: number;

    @Column({ default: true })
    @ApiProperty({ example: true, description: 'Whether the vacancy is active' })
    active: boolean;

    @CreateDateColumn()
    @ApiProperty({ type: String, example: new Date().toISOString(), description: 'Creation timestamp' })
    createdAt: Date;

    @OneToMany(() => Aplication, (a) => a.vacancy)
    @ApiProperty({ type: () => [Aplication], description: 'List of applications for this vacancy', required: false })
    applications: Aplication[];
}
