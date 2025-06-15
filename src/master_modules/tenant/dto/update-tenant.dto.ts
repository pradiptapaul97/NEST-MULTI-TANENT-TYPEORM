import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';

export class UpdateTenantDto extends PartialType(OmitType(CreateTenantDto, ['key'] as const)) { }
