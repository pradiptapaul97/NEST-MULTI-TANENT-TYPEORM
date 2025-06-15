// src/users/dto/create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserMasterDto {
    @ApiProperty({ example: 'John' })
    @IsString()
    firstName: string;

    @ApiPropertyOptional({ example: 'Doe' })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securePassword123' })
    @IsString()
    password: string;

    @ApiProperty({ example: 1, description: 'Role ID to assign to the user' })
    // @Type(() => Number) // 👈 this converts string to number
    @IsString()
    roleId: string;
}
