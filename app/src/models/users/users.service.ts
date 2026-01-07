import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * User registration
   * Default role: CODER
   * ADMIN y GESTOR only by seeders
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role } = createUserDto;

    //  Do not allow the creation of ADMIN or MANAGER accounts per record.
    if (role && role !== 'coder') {
      throw new BadRequestException(
        'Solo se permite registrar usuarios con rol CODER',
      );
    }

    // Avoid duplicate emails
    const exists = await this.usersRepository.findOne({
      where: { email },
    });

    if (exists) {
      throw new ConflictException('El correo ya está registrado');
    }

    //  Hash de password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: 'coder',
    });

    return this.usersRepository.save(user);
  }

  /**
   * List users
   * (normally only ADMIN)
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Search user by ID
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({id });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Search by email (auth)
   */
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  /**
   * Update user
   *Changing roles from here is not allowed.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    //  Do not allow role change
    if (updateUserDto.role) {
      throw new BadRequestException('No está permitido cambiar el rol');
    }

    //  Re-hash if password changes
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        10,
      );
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  /**
   * Delete user
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
