import { OmitType, PartialType } from "@nestjs/swagger";
import { PaginationQueryDto } from "src/common/dto/common.dto";

export class UserPaginationQueryDto extends PartialType(
    OmitType(PaginationQueryDto, [] as const)
) {
}
