import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
  BadRequestException
} from '@nestjs/common';
import { AplicationsService } from './aplications.service';
import { CreateAplicationDto } from './dto/create-aplication.dto';
import { UpdateAplicationDto } from './dto/update-aplication.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { Aplication } from './entities/aplication.entity';

@ApiTags('Applications')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key required for all requests',
})
@Controller('applications')
export class AplicationsController {
  constructor(private readonly aplicationsService: AplicationsService) {}

  // ========================
  // Crear postulación
  // ========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CODER')
  @Post()
  @ApiOperation({ summary: 'Crear postulación a una vacante' })
  @ApiBody({ type: CreateAplicationDto })
  @ApiResponse({ status: 201, description: 'Postulación creada', type: Aplication })
  @ApiResponse({ status: 400, description: 'Error de negocio' })
  async create(@Body() createAplicationDto: CreateAplicationDto, @Req() req: any) {
    return this.aplicationsService.create(createAplicationDto, req.user.id);
  }

  // ========================
  // Listar postulaciones
  // ========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GESTOR', 'CODER')
  @Get()
  @ApiOperation({ summary: 'Listar todas las postulaciones' })
  @ApiResponse({ status: 200, description: 'Listado de postulaciones', type: [Aplication] })
  async findAll(@Req() req: any) {
    // Opcional: si es CODER, solo devuelve sus postulaciones
    if (req.user.role === 'CODER') {
      return this.aplicationsService.findOne(req.user.id);
    }
    return this.aplicationsService.findAll();
  }

  // ========================
  // Obtener postulación por ID
  // ========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GESTOR', 'CODER')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener postulación por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Postulación encontrada', type: Aplication })
  @ApiResponse({ status: 404, description: 'Postulación no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const app = await this.aplicationsService.findOne(id);
    // Solo el propietario o Admin/Gestor puede ver
    if (req.user.role === 'CODER' && app.user.id !== req.user.id) {
      throw new BadRequestException('No tienes permiso para ver esta postulación');
    }
    return app;
  }

  // ========================
  // Actualizar postulación (opcional)
  // ========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GESTOR')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar postulación' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAplicationDto })
  @ApiResponse({ status: 200, description: 'Postulación actualizada', type: Aplication })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAplicationDto: UpdateAplicationDto,
  ) {
    return this.aplicationsService.update(id, updateAplicationDto);
  }

  // ========================
  // Eliminar postulación
  // ========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GESTOR', 'CODER')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar postulación' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Postulación eliminada' })
  @ApiResponse({ status: 403, description: 'No tienes permisos' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const app = await this.aplicationsService.findOne(id);
    if (req.user.role === 'CODER' && app.user.id !== req.user.id) {
      throw new BadRequestException('No puedes eliminar esta postulación');
    }
    return this.aplicationsService.remove(id);
  }
}
