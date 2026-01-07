import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAplicationDto } from './dto/create-aplication.dto';
import { UpdateAplicationDto } from './dto/update-aplication.dto';
import { Aplication } from './entities/aplication.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AplicationsService {
  constructor(
    @InjectRepository(Aplication) private readonly repo: Repository<Aplication>,
    @InjectRepository(Vacancy) private readonly vacancyRepo: Repository<Vacancy>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Crear una postulación
   * - Verifica si la vacante existe y está activa
   * - Evita duplicados
   * - No permite aplicar si la vacante está llena
   * - Limita a 3 postulaciones activas por usuario
   */
  async create(createAplicationDto: CreateAplicationDto, userId: number) {
    const { vacancy_id } = createAplicationDto;

    // 1️⃣ Buscar vacante
    const vacancy = await this.vacancyRepo.findOneBy({ id: vacancy_id });
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    if (!vacancy.active) throw new BadRequestException('Vacancy is not active');

    // 2️⃣ Buscar usuario
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    // 3️⃣ Verificar si ya aplicó
    const exists = await this.repo.findOne({
      where: { user: { id: user.id }, vacancy: { id: vacancy.id } },
    });
    if (exists) throw new BadRequestException('Ya aplicaste a esta vacante');

    // 4️⃣ Verificar cupo de la vacante
    const count = await this.repo.count({ where: { vacancy: { id: vacancy.id } } });
    if (count >= vacancy.maxApplicants) throw new BadRequestException('Vacante llena');

    // 5️⃣ Verificar máximo 3 postulaciones activas
    const activeApps = await this.repo
      .createQueryBuilder('a')
      .leftJoin('a.vacancy', 'v')
      .where('a.user_id = :userId', { userId })
      .andWhere('v.active = true')
      .getCount();
    if (activeApps >= 3) throw new BadRequestException('Ya tienes 3 postulaciones activas');

    // 6️⃣ Crear la postulación
    const application = this.repo.create({ user, vacancy });
    return this.repo.save(application);
  }

  findAll() {
    return this.repo.find({ relations: ['user', 'vacancy'] });
  }

  async findOne(id: number) {
    const application = await this.repo.findOne({
      where: { id },
      relations: ['user', 'vacancy'],
    });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async update(id: number, updateAplicationDto: UpdateAplicationDto) {
    await this.repo.update(id, updateAplicationDto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    const application = await this.findOne(id);
    return this.repo.remove(application);
  }
}
