import { Global, Module } from '@nestjs/common';
import { TenantRepository } from './tenant.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenant.entity';


@Global()
@Module({
    exports: [TenantRepository],
    providers: [TenantRepository],
    imports: [
        TypeOrmModule.forFeature([Tenant])
    ]
})
export class TenantRepositoryModule { }
