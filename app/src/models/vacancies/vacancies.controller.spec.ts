import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';

describe('VacanciesController', () => {
  let controller: VacanciesController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacanciesController],
      providers: [{ provide: VacanciesService, useValue: mockService }],
    }).compile();

    controller = module.get<VacanciesController>(VacanciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
