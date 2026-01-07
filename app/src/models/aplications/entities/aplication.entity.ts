import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';

@Entity()
export class Aplication {
  @PrimaryGeneratedColumn()
  id: number; 

  @ManyToOne(() => User, (u) => u.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Vacancy, (v) => v.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vacancy_id' }) 
  vacancy: Vacancy;

  @CreateDateColumn()
  appliedAt: Date;
}
