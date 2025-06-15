import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/tenant_modules/user/user.module';
import { HelperModule } from 'src/helper/helper.module';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenModule } from 'src/tenant_modules/refresh-token/refresh-token.module';

@Module({
  imports: [UserModule, HelperModule, JwtModule, RefreshTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
