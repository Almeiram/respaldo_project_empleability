import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';

describe('VacanciesService', () => {
  let service: VacanciesService;
  const mockRepo = {
    create: jest.fn((dto) => dto),
    save: jest.fn((v) => Promise.resolve({ id: '1', ...v })),
    find: jest.fn(() => []),
    findOneBy: jest.fn(() => null),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        { provide: getRepositoryToken(Vacancy), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a vacancy', async () => {
    const dto = { title: 't', description: 'd', location: 'Medellin', modality: 'remoto', company: 'X', maxApplicants: 3 } as any;
    const v = await service.create(dto);
    expect(v).toHaveProperty('id');
    expect(mockRepo.create).toHaveBeenCalled();
  });
});
