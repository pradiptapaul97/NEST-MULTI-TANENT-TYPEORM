import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserMasterDto } from './dto/create-user.dto';
import { UserPaginationQueryDto } from './dto/list-user.dto';
import { UpdateUserMasterDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';
import { RoleRepository } from '../role/repository/role.repository';

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository
  ) { }


  async create(createUserDto: CreateUserMasterDto) {

    const role = await this.roleRepository.getByField({
      id: createUserDto.roleId,
      isDeleted: false
    });

    if (!role?.id) {
      throw new NotFoundException('Role not found');
    }

    let saveUser = await this.userRepository.save({
      ...createUserDto,
      role, // assign role entity
    });
    return { data: saveUser, message: 'This action adds a new user' };
  }

  async findAll(query: UserPaginationQueryDto) {

    let listData = await this.userRepository.getAllPaginateByUser(query);
    return { data: listData, message: `This action returns all user` };
  }

  async findOne(id: number) {

    let userData = await this.userRepository.getByField({
      id,
      isDeleted: false
    });

    if (!userData?.id) {
      throw new NotFoundException('User not found');
    }
    return { data: userData, message: `This action returns a #${id} user` };
  }

  async update(id: number, updateUserDto: UpdateUserMasterDto) {

    let userData = await this.userRepository.getByField({
      id,
      isDeleted: false
    });

    if (!userData?.id) {
      throw new NotFoundException('User not found');
    }

    let updateUser = await this.userRepository.updateById(id, updateUserDto);

    return {
      data: updateUser, message: `This action updates a #${id} user`
    };
  }

  async remove(id: number) {

    let userData = await this.userRepository.getByField({
      id,
      isDeleted: false
    });

    if (!userData?.id) {
      throw new NotFoundException('User not found');
    }

    let updateUser = await this.userRepository.updateById(id, {
      isDeleted: true
    });

    return {
      data: updateUser, message: `This action removes a #${id} user`
    };
  }
}
