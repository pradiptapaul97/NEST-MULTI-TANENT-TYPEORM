import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/bases/base.repository";
import { Repository } from "typeorm";
import { Role } from "../entities/role.entity";


@Injectable()
export class RoleRepository extends BaseRepository<Role> {

    constructor(@InjectRepository(Role) private readonly rolesRepository: Repository<Role>) {
        super(rolesRepository)
    }
}

