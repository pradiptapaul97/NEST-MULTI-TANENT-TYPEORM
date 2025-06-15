import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { HelperModule } from 'src/helper/helper.module';


@Global()
@Module({
    exports: [UserRepository],
    providers: [UserRepository],
    imports: [
        TypeOrmModule.forFeature([User]),
        HelperModule
    ]
})
export class UserRepositoryModule { }
