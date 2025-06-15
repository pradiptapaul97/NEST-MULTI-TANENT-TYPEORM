import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantRepository } from './repository/tenant.repository';
import { PaginationQueryDto } from 'src/common/dto/common.dto';
import { DataSource } from 'typeorm';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class TenantService {

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly dataSource: DataSource,
    private readonly helperService: HelperService,
  ) { }


  async create(createTenantDto: CreateTenantDto) {
    // Step 1: Save tenant metadata to main DB
    let saveTenant = await this.tenantRepository.save(createTenantDto);

    if (!saveTenant?.id) {
      throw new NotFoundException('Tenant not added');
    }

    // Create tenant DB
    const dbName = `nest_mysql_${createTenantDto.key}`;
    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.query(`CREATE DATABASE \`${dbName}\``);
    await runner.release();

    await this.helperService.createTenantConnection(dbName); // ✅ Initialize schema

    return { data: saveTenant, message: 'This action adds a new tenant' };
  }

  async findAll(query: PaginationQueryDto) {

    let listData = await this.tenantRepository.getAllPaginateByTenant(query);
    return { data: listData, message: `This action returns all tenant` };
  }

  async findOne(id: number) {

    let tenantData = await this.tenantRepository.getByField({
      id,
      isDeleted: false
    });

    if (!tenantData?.id) {
      throw new NotFoundException('Tenant not found');
    }
    return { data: tenantData, message: `This action returns a #${id} tenant` };
  }

  async update(id: number, updateTenantDto: UpdateTenantDto) {

    let tenantData = await this.tenantRepository.getByField({
      id,
      isDeleted: false
    });

    if (!tenantData?.id) {
      throw new NotFoundException('Tenant not found');
    }

    let updateTenant = await this.tenantRepository.updateById(id, updateTenantDto);

    return {
      data: updateTenant, message: `This action updates a #${id} tenant`
    };
  }

  async remove(id: number) {
    let tenantData = await this.tenantRepository.getByField({
      id,
      isDeleted: false
    });

    if (!tenantData?.id) {
      throw new NotFoundException('User not found');
    }

    let updateUser = await this.tenantRepository.updateById(id, {
      isDeleted: true
    });

    return {
      data: updateUser, message: `This action removes a #${id} tenant`
    };
  }
}
