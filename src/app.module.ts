import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MasterConfigModule } from './config.module';
import { HelperModule } from './helper/helper.module';
import { AuthMasterModule } from './master_modules/auth/auth.module';
import { RefreshTokenMasterModule } from './master_modules/refresh-token/refresh-token.module';
import { RoleMasterModule } from './master_modules/role/role.module';
import { UserMasterModule } from './master_modules/user/user.module';
import { AuthModule } from './tenant_modules/auth/auth.module';
import { RefreshTokenModule } from './tenant_modules/refresh-token/refresh-token.module';
import { RoleModule } from './tenant_modules/role/role.module';
import { UserModule } from './tenant_modules/user/user.module';
import { TenantMasterModule } from './master_modules/tenant/tenant.module';

@Module({
  imports: [
    MasterConfigModule,
    UserMasterModule,
    HelperModule,
    RoleMasterModule,
    AuthMasterModule,
    RefreshTokenMasterModule,
    TenantMasterModule,

    UserModule,
    RoleModule,
    AuthModule,
    RefreshTokenModule
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule { }
