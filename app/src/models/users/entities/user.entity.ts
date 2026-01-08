import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Aplication } from '../../aplications/entities/aplication.entity';

export type UserRole = 'admin' | 'gestor' | 'coder';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column({ default: 'coder' })
	role: UserRole;

	@CreateDateColumn()
	createdAt: Date;

	@OneToMany(() => Aplication, (a) => a.user)
	applications: Aplication[];
}
