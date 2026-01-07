import { Test, TestingModule } from '@nestjs/testing';
import { AplicationsService } from './aplications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Aplication } from './entities/aplication.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { User } from '../users/entities/user.entity';

describe('AplicationsService', () => {
  let service: AplicationsService;
  const apRepo = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    create: jest.fn((v) => v),
    save: jest.fn((v) => Promise.resolve({ id: 'a', ...v })),
    count: jest.fn(() => 0),
    createQueryBuilder: jest.fn(() => ({ leftJoin: () => ({ where: () => ({ andWhere: () => ({ getCount: () => 0 }) }) }) })),
  };
  const vacRepo = { findOneBy: jest.fn() };
  const userRepo = { findOneBy: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AplicationsService,
        { provide: getRepositoryToken(Aplication), useValue: apRepo },
        { provide: getRepositoryToken(Vacancy), useValue: vacRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<AplicationsService>(AplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an application when valid', async () => {
    vacRepo.findOneBy.mockResolvedValue({ id: 'v1', active: true, maxApplicants: 5 });
    userRepo.findOneBy.mockResolvedValue({ id: 'u1' });
    apRepo.findOne.mockResolvedValue(null);
    apRepo.count.mockResolvedValue(0);
    const res = await service.create({ vacancyId: 'v1' } as any, 'u1');
    expect(res).toHaveProperty('id');
  });
});
