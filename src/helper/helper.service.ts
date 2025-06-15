// src/helper/helper.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from 'src/tenant_modules/refresh-token/entities/refresh-token.entity';
import { Role } from 'src/tenant_modules/role/entities/role.entity';
import { User } from 'src/tenant_modules/user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

const connectionMap = new Map<string, DataSource>();
const dataSourceCache: Record<string, DataSource> = {};

@Injectable()
export class HelperService {

    constructor(
        private readonly configService: ConfigService,
    ) { }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async comparePassword(raw: string, hash: string): Promise<boolean> {
        return bcrypt.compare(raw, hash);
    }

    capitalizeWords(text: string): string {
        return text.replace(/\b\w/g, char => char.toUpperCase());
    }

    async createTenantConnection(dbName: string): Promise<DataSource> {
        const options: DataSourceOptions = {
            type: 'mysql',
            host: this.configService.getOrThrow<string>('DB_HOST'),
            port: parseInt(this.configService.getOrThrow<string>('DB_PORT'), 3306),
            username: this.configService.getOrThrow<string>('DB_USERNAME'),
            password: this.configService.getOrThrow<string>('DB_PASSWORD'),
            database: dbName,
            synchronize: this.configService.get<string>('SYNCHRONIZE') === 'true',
            entities: [User, RefreshToken, Role], // 👈 Add other tenant-specific entities here
        };

        const dataSource = new DataSource(options);
        return dataSource.initialize();
    };

    async getTenantDataSource(tenantId: string, dbName: string): Promise<DataSource> {
        if (dataSourceCache[tenantId]) return dataSourceCache[tenantId];

        const dataSource = new DataSource({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: dbName,
            entities: [User, Role, RefreshToken],
            synchronize: this.configService.get<string>('SYNCHRONIZE') === 'true',
        });

        await dataSource.initialize();
        dataSourceCache[tenantId] = dataSource;
        return dataSource;
    };
}
