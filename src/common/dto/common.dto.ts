import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class PaginationQueryDto {
    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page: number = 1;

    @ApiPropertyOptional({ description: 'Page size', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit: number = 10;

    @ApiPropertyOptional({ description: 'Search term' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Field to sort by' })
    @IsOptional()
    @IsString()
    sortField?: string = 'createdAt'; // default sort field

    @ApiPropertyOptional({
        enum: ['ASC', 'DESC'],
        description: 'Sort order (ASC or DESC)',
        default: 'ASC',
    })
    @IsOptional()
    @IsString()
    sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

export class LoginDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Email of the user',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'StrongPassword123!',
        description: 'Password of the user',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}


export class DateRangeDto {
    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false, description: 'Start date', default: 'YYYY-MM-DD' })
    start_date: string

    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false, description: 'End date', default: 'YYYY-MM-DD' })
    end_date: string
}

export class MaxMinDto {
    @IsOptional()
    @ApiProperty({ required: false, type: 'number', description: 'Max' })
    max: number

    @IsOptional()
    @ApiProperty({ required: false, type: 'number', description: 'Min' })
    min: number
}

export class SortDto {
    @IsOptional()
    @ApiProperty({ required: false, type: 'string', enum: ['createdAt', 'updatedAt'], default: 'createdAt' })
    field: 'createdAt' | 'updatedAt';

    @IsOptional()
    @ApiProperty({ required: false, type: 'string', enum: ["asc", "desc"] })
    order: "asc" | "desc";
}