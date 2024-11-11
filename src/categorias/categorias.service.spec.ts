import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from './categorias.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { PinoLoggerService } from '../core/pino-logger.service'; 
import { Repository } from 'typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

describe('CategoriasService', () => {
  let service: CategoriasService;
  let categoriaRepository: Repository<Categoria>;
  let logger: PinoLoggerService;

  const mockCategoriaRepository = {
    create: jest.fn().mockReturnThis(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        {
          provide: getRepositoryToken(Categoria),
          useValue: mockCategoriaRepository,
        },
        {
          provide: PinoLoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<CategoriasService>(CategoriasService);
    categoriaRepository = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
    logger = module.get<PinoLoggerService>(PinoLoggerService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('buscar todo', () => {
    it('debe devolver todas las categorías', () => {
      const result = service.findAll();
      expect(result).toBe('Esta acción devuelve todas las categorías');
    });
  });

  describe('buscar uno', () => {
    it('debe devolver la categoría por id', () => {
      const result = service.findOne(1);
      expect(result).toBe('Esta acción devuelve la categoría #1');
    });
  });

  describe('actualizar', () => {
    it('debe actualizar una categoría por id', () => {
      const updateCategoriaDto: UpdateCategoriaDto = { nombre: 'Categoría Actualizada' };

      const result = service.update(1, updateCategoriaDto);
      expect(result).toBe('Esta acción actualiza la categoría #1');
    });
  });

  describe('eliminar', () => {
    it('debe eliminar una categoría por id', () => {
      const result = service.remove(1);
      expect(result).toBe('Esta acción elimina la categoría #1');
    });
  });
});
