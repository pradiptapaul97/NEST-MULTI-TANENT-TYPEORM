import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/bases/base.repository";
import { PaginationResponse } from "src/common/types/api-response.type";
import { Repository } from "typeorm";
import { PaginationQueryDto } from "src/common/dto/common.dto";
import { Tenant } from "../entities/tenant.entity";


@Injectable()
export class TenantRepository extends BaseRepository<Tenant> {
    constructor(
        @InjectRepository(Tenant) private readonly tenantsRepository: Repository<Tenant>,
    ) {
        super(tenantsRepository)
    }

    async safeRegExp(tenantInput: string, flags = "i") {
        try {
            const sanitizedInput = tenantInput.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            return new RegExp(sanitizedInput, flags);
        } catch (error) {
            throw new HttpException('Invalid search text.', HttpStatus.INTERNAL_SERVER_ERROR);;
        }
    }


    async getAllPaginateByTenant(paginationQueryDto: PaginationQueryDto): Promise<PaginationResponse<Tenant>> {

        const { page, limit, search } = paginationQueryDto;
        const skip = (page - 1) * limit;

        const queryBuilder = await this.tenantsRepository
            .createQueryBuilder('tenants')
            .where('tenants.isDeleted = :isDeleted', { isDeleted: false });

        if (search) {
            queryBuilder.andWhere(
                '(tenants.name LIKE :search OR tenants.key LIKE :search)',
                { search: `%${search}%` },
            );
        }

        const [data, totalDocs] = await queryBuilder
            .skip(skip)
            .take(limit)
            .orderBy('tenants.createdAt', 'DESC')
            .getManyAndCount();

        const hasMoreDocs = totalDocs > 0;
        const remainingDocs = totalDocs - (skip + data.length) > 0;
        const hasNextPage = hasMoreDocs && remainingDocs;
        const hasPrevPage = page != 1;


        return {
            meta: {
                totalDocs: totalDocs,
                skip: skip,
                page: page,
                limit: limit,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevPage: hasPrevPage ? (page - 1) : null,
                nextPage: hasNextPage ? (page + 1) : null,
            },
            docs: data,
        };
    }


}

