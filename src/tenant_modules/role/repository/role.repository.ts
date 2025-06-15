import { BadRequestException, Injectable } from "@nestjs/common";
import { HelperService } from "src/helper/helper.service";
import { CreateRoleDto } from "../dto/create-role.dto";
import { Role } from "../entities/role.entity";
import { FindOptionsWhere } from "typeorm";


@Injectable()
export class RoleRepository {

    constructor(
        private readonly helperService: HelperService
    ) { }

    private async prepareTenantContext(tenantId: string) {
        const dataSource = await this.helperService.getTenantDataSource(tenantId, `nest_mysql_${tenantId}`);
        return dataSource.getRepository(Role);
    }

    async save(tenantId: string, data: CreateRoleDto) {
        try {
            const repository = await this.prepareTenantContext(tenantId);
            const newData = repository.create(data);
            return await repository.save(newData);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getByField(tenantId: string, where: FindOptionsWhere<Role>) {
        try {
            const repository = await this.prepareTenantContext(tenantId);
            return await repository.findOne({ where });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}

