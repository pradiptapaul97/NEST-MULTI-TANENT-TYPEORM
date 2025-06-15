import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateTenantDto {

    @ApiProperty({ example: 'Acme Corporation', description: 'Name of the tenant' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 'acme-corp', description: 'Unique tenant key (used in headers)' })
    @IsString()
    @MinLength(2)
    key: string;
}
