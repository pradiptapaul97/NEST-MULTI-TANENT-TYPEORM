import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction } from "express";
import { TenantService } from "src/master_modules/tenant/tenant.service";

// tenant.middleware.ts
@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(private readonly tenantService: TenantService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.headers['x-tenant-id'];

        if (!tenantId || typeof tenantId !== 'string') {
            throw new BadRequestException('x-tenant-id header is required');
        }

        const tenant = await this.tenantService.findByHeaderId(tenantId);

        if (!tenant) {
            throw new NotFoundException('Tenant not found');
        }

        req['tenantId'] = tenantId;
        req['tenant'] = tenant;
        next();
    }
}
