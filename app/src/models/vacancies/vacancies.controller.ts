import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { Vacancy } from './entities/vacancy.entity';

@ApiTags('Vacancies')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key required for all requests',
})
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  // ========================
  // Crear vacante
  // ========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GESTOR')
  @Post()
  @ApiOperation({ summary: 'Crear una nueva vacante' })
  @ApiBody({ type: CreateVacancyDto })
  @ApiResponse({ status: 201, description: 'Vacante creada', type: Vacancy })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  // ========================
  // Listar todas las vacantes activas
  // ========================
  @Get()
  @ApiOperation({ summary: 'Listar vacantes activas' })
  @ApiResponse({ status: 200, description: 'Listado de vacantes', type: [Vacancy] })
  findAll() {
    return this.vacanciesService.findAll();
  }

  // ========================
  // Obtener vacante por ID
  // ========================
  @Get(':id')
  @ApiOperation({ summary: 'Obtener vacante por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Vacante encontrada', type: Vacancy })
  @ApiResponse({ status: 404, description: 'Vacante no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vacanciesService.findOne(id);
  }

  // ========================
  // Actualizar vacante
  // ========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GESTOR')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar vacante' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateVacancyDto })
  @ApiResponse({ status: 200, description: 'Vacante actualizada', type: Vacancy })
  @ApiResponse({ status: 400, description: 'Error de validación' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVacancyDto: UpdateVacancyDto,
  ) {
    return this.vacanciesService.update(id, updateVacancyDto);
  }

  // ========================
  // Activar o Inactivar vacante
  // ========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GESTOR')
  @Patch(':id/status/:active')
  @ApiOperation({ summary: 'Activar o inactivar vacante' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({
    name: 'active',
    type: Boolean,
    description: 'true = activa, false = inactiva',
  })
  @ApiResponse({ status: 200, description: 'Estado actualizado', type: Vacancy })
  setActiveStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('active') active: string,
  ) {
    const isActive = active === 'true';
    return this.vacanciesService.setActiveStatus(id, isActive);
  }

  // ========================
  // Eliminar vacante
  // ========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GESTOR')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar vacante' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Vacante eliminada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vacanciesService.remove(id);
  }
}
