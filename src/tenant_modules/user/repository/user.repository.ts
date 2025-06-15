import { Injectable } from "@nestjs/common";
import { HelperService } from "src/helper/helper.service";
import { DeepPartial } from "typeorm";
import { User } from "../entities/user.entity";


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

    // async findOneByEmail(param: any): Promise<User | null> {
    //     console.log({ param });
    //     try {
    //         return this.usersRepository.findOne({ where: param });
    //     } catch (error) {
    //         throw new BadGatewayException(error.message)
    //     }

    // }

    // async safeRegExp(userInput: string, flags = "i") {
    //     try {
    //         const sanitizedInput = userInput.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    //         return new RegExp(sanitizedInput, flags);
    //     } catch (error) {
    //         throw new HttpException('Invalid search text.', HttpStatus.INTERNAL_SERVER_ERROR);;
    //     }
    // }


    // async getAllPaginateByUser(paginationQueryDto: UserPaginationQueryDto): Promise<PaginationResponse<User>> {

    //     const { page, limit, search } = paginationQueryDto;
    //     const skip = (page - 1) * limit;

    //     const queryBuilder = await this.usersRepository
    //         .createQueryBuilder('users')
    //         .where('users.isDeleted = :isDeleted', { isDeleted: false });

    //     if (search) {
    //         queryBuilder.andWhere(
    //             '(users.firstName LIKE :search OR users.email LIKE :search OR users.lastName LIKE :search)',
    //             { search: `%${search}%` },
    //         );
    //     }

    //     const [data, totalDocs] = await queryBuilder
    //         .skip(skip)
    //         .take(limit)
    //         .orderBy('users.createdAt', 'DESC')
    //         .getManyAndCount();

    //     const hasMoreDocs = totalDocs > 0;
    //     const remainingDocs = totalDocs - (skip + data.length) > 0;
    //     const hasNextPage = hasMoreDocs && remainingDocs;
    //     const hasPrevPage = page != 1;


    //     return {
    //         meta: {
    //             totalDocs: totalDocs,
    //             skip: skip,
    //             page: page,
    //             limit: limit,
    //             hasPrevPage: hasPrevPage,
    //             hasNextPage: hasNextPage,
    //             prevPage: hasPrevPage ? (page - 1) : null,
    //             nextPage: hasNextPage ? (page + 1) : null,
    //         },
    //         docs: data,
    //     };
    // }


}

