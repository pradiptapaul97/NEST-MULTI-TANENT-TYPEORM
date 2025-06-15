import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HelperService } from "src/helper/helper.service";
import { DeepPartial, FindOptionsWhere } from "typeorm";
import { User } from "../entities/user.entity";
import { UserPaginationQueryDto } from "../dto/list-user.dto";
import { PaginationResponse } from "src/common/types/api-response.type";


@Injectable()
export class UserRepository {
    constructor(
        private readonly helperService: HelperService
    ) { }

    private async prepareTenantContext(tenantId: string) {
        const dataSource = await this.helperService.getTenantDataSource(tenantId, `nest_mysql_${tenantId}`);
        return dataSource.getRepository(User);
    }

    async save(tenantId: string, data: DeepPartial<User>) {
        const repository = await this.prepareTenantContext(tenantId);
        const newData = repository.create(data);
        return await repository.save(newData);
    }

    async getByField(tenantId: string, where: FindOptionsWhere<User>) {
        const repository = await this.prepareTenantContext(tenantId);
        return await repository.findOne({ where });
    }

    async updateById(tenantId: string, id: string | number, data: DeepPartial<User>): Promise<User | null> {
        try {
            const repository = await this.prepareTenantContext(tenantId);
            const entity = await repository.findOne({ where: { id } as any });

            if (!entity) {
                throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
            }

            const updatedEntity = repository.merge(entity, data);
            const result = await repository.save(updatedEntity);

            return result;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // async safeRegExp(userInput: string, flags = "i") {
    //     try {
    //         const sanitizedInput = userInput.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    //         return new RegExp(sanitizedInput, flags);
    //     } catch (error) {
    //         throw new HttpException('Invalid search text.', HttpStatus.INTERNAL_SERVER_ERROR);;
    //     }
    // }


    async getAllPaginateByUser(tenantId: string, paginationQueryDto: UserPaginationQueryDto): Promise<PaginationResponse<User>> {

        const repository = await this.prepareTenantContext(tenantId);
        const { page, limit, search } = paginationQueryDto;
        const skip = (page - 1) * limit;

        const queryBuilder = await repository
            .createQueryBuilder('users')
            .where('users.isDeleted = :isDeleted', { isDeleted: false });

        if (search) {
            queryBuilder.andWhere(
                '(users.firstName LIKE :search OR users.email LIKE :search OR users.lastName LIKE :search)',
                { search: `%${search}%` },
            );
        }

        const [data, totalDocs] = await queryBuilder
            .skip(skip)
            .take(limit)
            .orderBy('users.createdAt', 'DESC')
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

