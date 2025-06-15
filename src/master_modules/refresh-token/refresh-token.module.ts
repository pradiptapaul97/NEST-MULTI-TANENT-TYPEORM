import { Module } from '@nestjs/common';
import { RefreshTokenRepositoryModule } from './repository/refresh-token.repository.module';

@Module({
  imports: [RefreshTokenRepositoryModule]
})
export class RefreshTokenMasterModule { }
