import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.rolRepository.create(createRoleDto);
    return await this.rolRepository.save(role);
  }

  findAll() {
    return this.rolRepository.find();
  }

  async findOne(id: number) {
    try {
      const role = await this.rolRepository.findOne({ where: { id } });
      if (!role) throw new NotFoundException('Role not found');
      return role;
    } catch (error) {
      throw new NotFoundException('NotFoundException');
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await this.rolRepository.save({ ...updateRoleDto, id });
  }

  async remove(id: number) {
    const result = await this.rolRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return result;
  }
}