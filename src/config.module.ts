import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './master_modules/refresh-token/entities/refresh-token.entity';
import { Role } from './master_modules/role/entities/role.entity';
import { User } from './master_modules/user/entities/user.entity';
import { Tenant } from './master_modules/tenant/entities/tenant.entity';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`,
            isGlobal: true, // ✅ Make it globally available
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.getOrThrow<string>('DB_HOST'),
                port: parseInt(configService.getOrThrow<string>('DB_PORT'), 3306),
                username: configService.getOrThrow<string>('DB_USERNAME'),
                password: configService.getOrThrow<string>('DB_PASSWORD'),
                database: configService.getOrThrow<string>('DB_NAME'),
                entities: [User, RefreshToken, Role, Tenant],
                synchronize: configService.get<string>('SYNCHRONIZE') === 'true', // Don't use in production
            }),
        }),
        ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    ],
    providers: [
        Logger
    ],
    exports: [ConfigModule, TypeOrmModule],
})
export class MasterConfigModule { }
