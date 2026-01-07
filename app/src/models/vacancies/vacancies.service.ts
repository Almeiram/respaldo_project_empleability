import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { Vacancy } from './entities/vacancy.entity';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly repo: Repository<Vacancy>,
  ) {}

  /**
   * Crear una vacante
   * - Validar que tenga cupo maximo
   * - Inicializar vacante como activa
   */
  async create(createVacancyDto: CreateVacancyDto) {
    if (createVacancyDto.maxApplicants <= 0) {
      throw new BadRequestException('You must define a maximum quota greater than 0');
    }

    const vacancy = this.repo.create({ ...createVacancyDto, active: true });
    return this.repo.save(vacancy);
  }

  /**
   * Listar todas las vacantes activas
   */
  findAll() {
    return this.repo.find({ where: { active: true } });
  }

  /**
   * Obtener una vacante por ID
   */
  async findOne(id: number) {
    const vacancy = await this.repo.findOneBy({ id });
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  /**
   * Actualizar vacante
   * - Validar que maxApplicants sea positivo
   */
  async update(id: number, updateVacancyDto: UpdateVacancyDto) {
    const vacancy = await this.findOne(id);

    if (updateVacancyDto.maxApplicants !== undefined && updateVacancyDto.maxApplicants <= 0) {
      throw new BadRequestException('The maximum quota must be greater than 0');
    }

    Object.assign(vacancy, updateVacancyDto);
    return this.repo.save(vacancy);
  }

  /**
   * Eliminar vacante
   */
  async remove(id: number) {
    const vacancy = await this.findOne(id);
    return this.repo.remove(vacancy);
  }

  /**
   * Activar o inactivar una vacante
   */
  async setActiveStatus(id: number, active: boolean) {
    const vacancy = await this.findOne(id);
    vacancy.active = active;
    return this.repo.save(vacancy);
  }
}
