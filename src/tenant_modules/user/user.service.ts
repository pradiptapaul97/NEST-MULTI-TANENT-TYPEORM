import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../role/repository/role.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';
import { UserPaginationQueryDto } from './dto/list-user.dto';
import { UpdateUserMasterDto } from 'src/master_modules/user/dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository
  ) { }


  async create(tenantId: string, createUserDto: CreateUserDto) {

    const role = await this.roleRepository.getByField(tenantId, {
      id: createUserDto.roleId,
      isDeleted: false
    });

    if (!role?.id) {
      throw new NotFoundException('Role not found');
    }

    let saveUser = await this.userRepository.save(tenantId, {
      ...createUserDto,
      role, // assign role entity
    });
    return { data: saveUser, message: 'This action adds a new user' };
  }

  async findAll(tenantId: string, query: UserPaginationQueryDto) {

    let listData = await this.userRepository.getAllPaginateByUser(tenantId, query);
    return { data: listData, message: `This action returns all user` };
  }

  async findOne(tenantId: string, id: number) {

    let userData = await this.userRepository.getByField(tenantId, {
      id,
      isDeleted: false
    });

    if (!userData?.id) {
      throw new NotFoundException('User not found');
    }
    return { data: userData, message: `This action returns a #${id} user` };
  }

  async update(tenantId: string, id: number, updateUserDto: UpdateUserMasterDto) {

    let userData = await this.userRepository.getByField(tenantId, {
      id,
      isDeleted: false
    });

    if (!userData?.id) {
      throw new NotFoundException('User not found');
    }

    let updateUser = await this.userRepository.updateById(tenantId, id, updateUserDto);

    return {
      data: updateUser, message: `This action updates a #${id} user`
    };
  }

  async remove(tenantId: string, id: number) {

    let userData = await this.userRepository.getByField(tenantId, {
      id,
      isDeleted: false
    });

    if (!userData?.id) {
      throw new NotFoundException('User not found');
    }

    let updateUser = await this.userRepository.updateById(tenantId, id, {
      isDeleted: true
    });

    return {
      data: updateUser, message: `This action removes a #${id} user`
    };
  }
}
