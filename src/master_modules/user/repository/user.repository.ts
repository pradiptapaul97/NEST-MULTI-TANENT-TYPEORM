import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/bases/base.repository";
import { PaginationResponse } from "src/common/types/api-response.type";
import { Repository } from "typeorm";
import { UserPaginationQueryDto } from "../dto/list-user.dto";
import { User } from "../entities/user.entity";


@Injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
    ) {
        super(usersRepository)
    }

    async safeRegExp(userInput: string, flags = "i") {
        try {
            const sanitizedInput = userInput.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            return new RegExp(sanitizedInput, flags);
        } catch (error) {
            throw new HttpException('Invalid search text.', HttpStatus.INTERNAL_SERVER_ERROR);;
        }
    }


    async getAllPaginateByUser(paginationQueryDto: UserPaginationQueryDto): Promise<PaginationResponse<User>> {

        const { page, limit, search } = paginationQueryDto;
        const skip = (page - 1) * limit;

        const queryBuilder = await this.usersRepository
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

