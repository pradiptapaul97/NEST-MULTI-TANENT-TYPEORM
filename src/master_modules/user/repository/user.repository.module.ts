import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';


@Global()
@Module({
    exports: [UserRepository],
    providers: [UserRepository],
    imports: [
        TypeOrmModule.forFeature([User])
    ]
})
export class UserRepositoryModule { }
