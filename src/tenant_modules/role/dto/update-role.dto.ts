import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateRoleDto extends PartialType(
    OmitType(CreateRoleDto, [] as const)
) {
    @ApiPropertyOptional({
        example: 'Active',
        description: 'Status of the role',
        enum: ['Active', 'Inactive'],
    })
    @IsOptional()
    @IsIn(['Active', 'Inactive'])
    status?: 'Active' | 'Inactive';
}
