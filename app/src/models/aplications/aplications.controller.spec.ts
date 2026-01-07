import { Test, TestingModule } from '@nestjs/testing';
import { AplicationsController } from './aplications.controller';
import { AplicationsService } from './aplications.service';

describe('AplicationsController', () => {
  let controller: AplicationsController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AplicationsController],
      providers: [{ provide: AplicationsService, useValue: mockService }],
    }).compile();

    controller = module.get<AplicationsController>(AplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
