import { Global, Module } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { HelperModule } from 'src/helper/helper.module';


@Global()
@Module({
    exports: [RoleRepository],
    providers: [RoleRepository],
    imports: [
        TypeOrmModule.forFeature([Role]),
        HelperModule
    ]
})
export class RoleRepositoryModule { }
