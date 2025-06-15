import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleRepository } from './repository/role.repository';

@Injectable()
export class RoleService {

  constructor(
    private readonly roleRepository: RoleRepository,
  ) { }

  async create(tenantId: string, createRoleDto: CreateRoleDto) {
    let saveUser = await this.roleRepository.save(tenantId, createRoleDto);
    return { data: saveUser, message: 'This action adds a new role' };
  }

  async findAll() {
    return `This action returns all role`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} role`;
  // }

  // update(id: number, updateRoleDto: UpdateRoleDto) {
  //   return `This action updates a #${id} role`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} role`;
  // }
}
