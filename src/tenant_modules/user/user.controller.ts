import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserPaginationQueryDto } from './dto/list-user.dto';
import { TenantId } from 'src/common/decorators/tenant.decorator';

@ApiTags("Tenant User")
@Controller('tenant/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@TenantId() tenantId: string, @Body() createUserDto: CreateUserDto) {
    return this.userService.create(tenantId, createUserDto);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Page size for pagination', type: Number })
  @ApiQuery({ name: 'sortField', required: false, description: 'Filter by parent ID' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Filter by parent ID' })
  findAll(@TenantId() tenantId: string, @Query() query: UserPaginationQueryDto) {
    return this.userService.findAll(tenantId, query);
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.userService.findOne(tenantId, +id);
  }

  @Patch(':id')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(tenantId, +id, updateUserDto);
  }

  @Delete(':id')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.userService.remove(tenantId, +id);
  }
}
