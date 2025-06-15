import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateRoleMasterDto } from './create-role.dto';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateRoleMasterDto extends PartialType(
    OmitType(CreateRoleMasterDto, [] as const)
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
