import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { TenantId } from 'src/common/decorators/tenant.decorator';

@ApiTags("Tenant Role")
@Controller('tenant/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  create(@TenantId() tenantId: string, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(tenantId, createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roleService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.roleService.update(+id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roleService.remove(+id);
  // }
}
