import { Global, Module } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';


@Global()
@Module({
    exports: [RoleRepository],
    providers: [RoleRepository],
    imports: [
        TypeOrmModule.forFeature([Role])
    ]
})
export class RoleRepositoryModule { }
