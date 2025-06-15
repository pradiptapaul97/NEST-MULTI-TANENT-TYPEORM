import { Injectable } from '@nestjs/common';
import { CreateRoleMasterDto } from './dto/create-role.dto';
import { UpdateRoleMasterDto } from './dto/update-role.dto';
import { RoleRepository } from './repository/role.repository';

@Injectable()
export class RoleService {

  constructor(
    private readonly roleRepository: RoleRepository,
  ) { }

  async create(createRoleDto: CreateRoleMasterDto) {
    let saveUser = await this.roleRepository.save(createRoleDto);
    return { data: saveUser, message: 'This action adds a new role' };
  }

  async findAll() {
    return `This action returns all role`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} role`;
  // }

  // update(id: number, updateRoleDto: UpdateRoleMasterDto) {
  //   return `This action updates a #${id} role`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} role`;
  // }
}
