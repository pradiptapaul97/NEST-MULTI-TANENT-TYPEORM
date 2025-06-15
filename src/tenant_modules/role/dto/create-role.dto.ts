import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ example: 'admin', description: 'Unique role identifier' })
    @IsString()
    role: string;

    @ApiProperty({ example: 'Administrator', description: 'Display name for the role' })
    @IsString()
    roleDisplayName: string;

    @ApiProperty({ example: 'frontend', description: 'Group the role belongs to' })
    @IsOptional()
    @IsString()
    roleGroup?: string = 'frontend';

    @ApiProperty({ example: 'This role has access to admin functionalities', description: 'Role description' })
    @IsOptional()
    @IsString()
    description?: string = '';
}
