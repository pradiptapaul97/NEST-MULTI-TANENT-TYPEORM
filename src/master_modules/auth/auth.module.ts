import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserMasterModule } from 'src/master_modules/user/user.module';
import { HelperModule } from 'src/helper/helper.module';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenMasterModule } from 'src/master_modules/refresh-token/refresh-token.module';

@Module({
  imports: [UserMasterModule, HelperModule, JwtModule, RefreshTokenMasterModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthMasterModule { }
