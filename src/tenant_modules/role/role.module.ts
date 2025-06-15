import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepositoryModule } from './repository/role.repository.module';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [RoleRepositoryModule],
})
export class RoleModule { }
