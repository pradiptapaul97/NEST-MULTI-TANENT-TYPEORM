import { BadRequestException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import {
    DeepPartial,
    FindOptionsOrder,
    FindOptionsWhere,
    In,
    Repository
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T> {
    constructor(private readonly repository: Repository<T>) { }

    async save(data: DeepPartial<T>): Promise<T | null> {
        try {
            let newData = this.repository.create(data);
            return await this.repository.save(newData);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getById(id: any): Promise<T | null> {
        try {
            return await this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getByField(where: FindOptionsWhere<T>): Promise<T | null> {
        try {
            return await this.repository.findOne({ where });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async updateById(id: string | number, data: DeepPartial<T>): Promise<T | null> {
        try {
            const entity = await this.repository.findOne({ where: { id } as any });

            if (!entity) {
                throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
            }

            const updatedEntity = this.repository.merge(entity, data);
            const result = await this.repository.save(updatedEntity);

            return result;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getAll(where: FindOptionsWhere<T>): Promise<T[]> {
        return await this.repository.find({ where });
    }

    async getAllByField(where: FindOptionsWhere<T>): Promise<T[]> {
        return await this.repository.find({ where });
    }

    async getCountByParam(where: FindOptionsWhere<T>): Promise<number> {
        return await this.repository.count({ where });
    }


    async delete(id: string | number): Promise<void> {
        await this.repository.delete(id);
    }

    async bulkDelete(where: FindOptionsWhere<T>): Promise<void> {
        await this.repository.delete(where);
    }

    async updateByField(where: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<T | null> {
        const entity = await this.repository.findOne({ where });

        if (!entity) {
            throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
        }

        const updatedEntity = this.repository.merge(entity, data);
        const result = await this.repository.save(updatedEntity);

        return result;
    }

    async bulkDeleteSoft(ids: (string | number)[]): Promise<void> {
        const result = await this.repository.update(
            { id: In(ids) } as any, // Make sure 'id' is the correct primary column name
            { isDeleted: true } as any
        );
        if (result.affected === 0) {
            throw new HttpException('Update failed: No rows affected', HttpStatus.NOT_FOUND);
        }
    }

    async getByFieldWithSort(
        where: FindOptionsWhere<T>,
        order?: FindOptionsOrder<T>
    ): Promise<T | null> {
        return await this.repository.findOne({ where, order });
    }

    async getDistinctDocument<K extends keyof T>(
        field: K,
        params: Partial<Record<keyof T, any>>
    ): Promise<T[K][]> {
        const alias = 'entity';

        const query = this.repository.createQueryBuilder(alias)
            .select(`DISTINCT ${alias}.${String(field)}`, 'distinctField');

        // Add where conditions
        Object.entries(params).forEach(([key, value]) => {
            query.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
        });

        const results = await query.getRawMany();

        // Extract just the distinct values
        return results.map(r => r['distinctField']);
    }

    async getAllByFieldWithProjection<K extends keyof T>(
        params: Partial<Record<keyof T, any>>,
        projection: K[]
    ): Promise<Pick<T, K>[]> {
        const alias = 'entity';

        const query = this.repository.createQueryBuilder(alias)
            .select(projection.map(field => `${alias}.${String(field)}`));

        // Add filter conditions
        Object.entries(params).forEach(([key, value]) => {
            query.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
        });

        return await query.getMany() as Pick<T, K>[];
    }

    async getByFieldWithProjection<K extends keyof T>(
        params: Partial<Record<keyof T, any>>,
        projection: K[],
    ): Promise<Pick<T, K> | null> {
        const alias = 'entity';

        const query = this.repository.createQueryBuilder(alias)
            .select(projection.map(field => `${alias}.${String(field)}`));

        // Add where conditions
        Object.entries(params).forEach(([key, value]) => {
            query.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
        });

        return await query.getOne() as Pick<T, K> | null;
    }


    async updateAllByParams(where: FindOptionsWhere<T>, data: QueryDeepPartialEntity<T>): Promise<void> {
        const query = this.repository.createQueryBuilder().update().set(data);

        Object.entries(where).forEach(([key, value], index) => {
            const paramKey = `param${index}`;
            const condition = `${key} = :${paramKey}`;
            if (index === 0) {
                query.where(condition, { [paramKey]: value });
            } else {
                query.andWhere(condition, { [paramKey]: value });
            }
        });

        await query.execute();
    }

    async saveOrUpdate(data: DeepPartial<T>, id?: string | number): Promise<T> {
        if (id) {
            const entity = await this.repository.findOne({ where: { id } as any });

            if (!entity) {
                throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
            }

            const updatedEntity = this.repository.merge(entity, data);
            const result = await this.repository.save(updatedEntity);

            return result;
        }
        return await this.save(data as DeepPartial<T>);
    }

    async saveOrUpdateByParams(where: FindOptionsWhere<T>, data: any): Promise<T> {

        const entity = await this.repository.findOne({ where });

        const updatedEntity = this.repository.merge(entity, data);
        const result = await this.repository.save(updatedEntity);

        return result;
    }
}
