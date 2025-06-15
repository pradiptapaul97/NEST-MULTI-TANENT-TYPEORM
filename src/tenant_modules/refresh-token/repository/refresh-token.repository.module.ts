import { Global, Module } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';

@Global()
@Module({
  exports: [RefreshTokenRepository],
  providers: [RefreshTokenRepository],
  imports: [
    TypeOrmModule.forFeature([RefreshToken])
  ]
})
export class RefreshTokenRepositoryModule { }
