import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;
  let repository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('debería crear un rol', async () => {
    const createRoleDto = { nombre: 'ADMIN' }; // Cambia según tus DTO
    const savedRole = { id: 1, ...createRoleDto };

    jest.spyOn(repository, 'create').mockReturnValue(savedRole as Role);
    jest.spyOn(repository, 'save').mockResolvedValue(savedRole as Role);

    const resultado = await service.create(createRoleDto);

    expect(repository.create).toHaveBeenCalledWith(createRoleDto);
    expect(repository.save).toHaveBeenCalledWith(savedRole);
    expect(resultado).toEqual(savedRole);
  });

  it('debería listar todos los roles', async () => {
    const roles = [{ id: 1, nombre: 'ADMIN' }, { id: 2, nombre: 'USER' }];
    jest.spyOn(repository, 'find').mockResolvedValue(roles as Role[]);

    const resultado = await service.findAll();

    expect(repository.find).toHaveBeenCalled();
    expect(resultado).toEqual(roles);
  });

  it('debería obtener un rol por id', async () => {
    const role = { id: 1, nombre: 'ADMIN' };
    jest.spyOn(repository, 'findOne').mockResolvedValue(role as Role);

    const resultado = await service.findOne(1);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(resultado).toEqual(role);
  });

  it('debería lanzar NotFoundException si el rol no existe', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('debería actualizar un rol', async () => {
    const updateRoleDto = { nombre: 'Usuario Actualizado' };
    const updatedRole = { id: 1, ...updateRoleDto };

    jest.spyOn(repository, 'save').mockResolvedValue(updatedRole as Role);

    const resultado = await service.update(1, updateRoleDto);

    expect(repository.save).toHaveBeenCalledWith({ ...updateRoleDto, id: 1 });
    expect(resultado).toEqual(updatedRole);
  });

  it('debería eliminar un rol', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

    const resultado = await service.remove(1);

    expect(repository.delete).toHaveBeenCalledWith(1);
    expect(resultado).toEqual({ affected: 1 });
  });

  it('debería lanzar NotFoundException si el rol a eliminar no existe', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});