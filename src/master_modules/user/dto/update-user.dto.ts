import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { CreateUserMasterDto } from './create-user.dto';

export class UpdateUserMasterDto extends PartialType(
    OmitType(CreateUserMasterDto, ['email'] as const)
) {
    @ApiPropertyOptional({ enum: ['Active', 'Inactive'], example: 'Active' })
    @IsOptional()
    @IsIn(['Active', 'Inactive'])
    status?: 'Active' | 'Inactive';
}
