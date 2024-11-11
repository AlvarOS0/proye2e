import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import { Role } from "../roles/entities/role.entity";
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let usuarioRepository: Repository<Usuario>;
  let roleRepository: Repository<Role>;

  const mockUsuarioRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockRoleRepository = {
    find: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },

      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    usuarioRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear un usuario nuevo', async () => {
      const createUsuarioDto = { usuario: 'testuser', correo: 'test@test.com', clave: 'testpass', roles: ['admin'] };
      const mockRoles = [{ id: 1, nombre: 'admin' } as Role];
      
      jest.spyOn(usuarioRepository, 'findOneBy').mockResolvedValue(null); 
      jest.spyOn(roleRepository, 'find').mockResolvedValue(mockRoles);
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedpassword'); 
      jest.spyOn(usuarioRepository, 'create').mockReturnValue({
        id: 1,
        ...createUsuarioDto,
        clave: 'hashedpassword',
        roles: mockRoles,
      } as Usuario); 
      jest.spyOn(usuarioRepository, 'save').mockResolvedValue({
        id: 1,
        ...createUsuarioDto,
        clave: 'hashedpassword',
        roles: mockRoles,
      } as Usuario); 

      const result = await service.create(createUsuarioDto);

      expect(result).toEqual({
        id: 1,
        ...createUsuarioDto,
        clave: 'hashedpassword',
        roles: mockRoles,
      });
    });


  it('debe crear un usuario y encriptar la clave', async () => {
    const createUsuarioDto = {
      usuario: 'testuser',
      clave: 'password123',
      correo: 'test@example.com',
      roles: ['admin'],
    };

    mockUsuarioRepository.findOneBy = jest.fn().mockResolvedValue(null);
    mockRoleRepository.find = jest.fn().mockResolvedValue([{ nombre: 'admin' }]);
    mockUsuarioRepository.create = jest.fn().mockReturnValue(createUsuarioDto);
    mockUsuarioRepository.save = jest.fn().mockResolvedValue(createUsuarioDto);

    const result = await service.create(createUsuarioDto);

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(mockUsuarioRepository.save).toHaveBeenCalledWith(createUsuarioDto);
    expect(result).toEqual(createUsuarioDto);
  });

    it('debe lanzar ConflictException si el correo ya existe', async () => {
      mockUsuarioRepository.findOneBy.mockResolvedValue({ correo: 'test@test.com' });
      const createUsuarioDto = { usuario: 'testuser', clave: 'password123', correo: 'test@test.com', roles: ['admin'] };

      await expect(service.create(createUsuarioDto)).rejects.toThrow(ConflictException);
    });

    it('debe lanzar NotFoundException si un rol no se encuentra', async () => {
      mockUsuarioRepository.findOneBy.mockResolvedValue(null);
      mockRoleRepository.find.mockResolvedValue([]);

      const createUsuarioDto = { usuario: 'testuser', clave: 'password123', correo: 'test@test.com', roles: ['admin'] };
      await expect(service.create(createUsuarioDto)).rejects.toThrow(NotFoundException);
    });
  });

  /*describe('validarUsuario', () => {
    it('debe devolver un token de acceso si la validación es exitosa', async () => {
      const validateUsuarioDto = { usuario: 'testuser', clave: 'password123' };
      const usuario = { usuario: 'testuser', clave: await bcrypt.hash('password123', 10), roles: [{ nombre: 'admin' }] };
      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.validarUsuario(validateUsuarioDto);

      expect(result).toEqual({ access_token: 'token' });
    });

    it('debe lanzar NotFoundException si el usuario no se encuentra', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);
      const validateUsuarioDto = { usuario: 'testuser', clave: 'password123' };

      await expect(service.validarUsuario(validateUsuarioDto)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException si la clave es incorrecta', async () => {
      const validateUsuarioDto = { usuario: 'testuser', clave: 'wrongpassword' };
      const usuario = { usuario: 'testuser', clave: await bcrypt.hash('password123', 10) };
      mockUsuarioRepository.findOne.mockResolvedValue(usuario);

      await expect(service.validarUsuario(validateUsuarioDto)).rejects.toThrow(NotFoundException);
    });
  });*/

  describe('findAll', () => {
    it('debe devolver una lista de usuarios', async () => {
      const usuarios = [{ usuario: 'testuser', correo: 'test@test.com', roles: [] }];
      mockUsuarioRepository.find.mockResolvedValue(usuarios);

      const result = await service.findAll();

      expect(result).toEqual(usuarios);
    });
  });

  describe('findOne', () => {
    it('debe devolver un usuario por ID', async () => {
      const usuario = { usuario: 'testuser', correo: 'test@test.com', roles: [] };
      mockUsuarioRepository.findOne.mockResolvedValue(usuario);

      const result = await service.findOne(1);

      expect(result).toEqual(usuario);
    });

    it('debe lanzar NotFoundException si el usuario no se encuentra', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });



  describe('remove', () => {
    it('debe eliminar un usuario por ID', async () => {
      mockUsuarioRepository.softDelete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('debe lanzar NotFoundException si el usuario no se encuentra', async () => {
      mockUsuarioRepository.softDelete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});