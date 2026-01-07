import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AplicationsService } from './aplications.service';
import { AplicationsController } from './aplications.controller';
import { Aplication } from './entities/aplication.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aplication, Vacancy, User])],
  controllers: [AplicationsController],
  providers: [AplicationsService],
})
export class AplicationsModule {}
