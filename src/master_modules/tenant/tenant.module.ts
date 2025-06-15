import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantRepositoryModule } from './repository/tenant.repository.module';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [TenantRepositoryModule, HelperModule],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantMasterModule { }
