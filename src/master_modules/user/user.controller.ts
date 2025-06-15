import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserMasterDto } from './dto/create-user.dto';
import { UpdateUserMasterDto } from './dto/update-user.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserPaginationQueryDto } from './dto/list-user.dto';

@ApiTags("Master User")
@Controller('master/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserMasterDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Page size for pagination', type: Number })
  @ApiQuery({ name: 'sortField', required: false, description: 'Filter by parent ID' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Filter by parent ID' })
  findAll(@Query() query: UserPaginationQueryDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserMasterDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
