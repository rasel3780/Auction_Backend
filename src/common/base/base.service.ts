import { PaginationQueryDto } from '../../common/dtos/PaginationQuery.dto';
import { PagedResponseDto } from '../../common/dtos/PagedResponse.dto'
import { ApiResponse, ok, fail } from '../../common/helper/api-response.dto';
import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Repository } from 'typeorm';


export interface IBaseCrudService<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(dto: any): Promise<T>;
  update(id: string, dto: any): Promise<T | null>;
  softDelete(id: string): Promise<boolean>;
  getPaged(pagination: PaginationQueryDto): Promise<any>;
}

export class BaseService<T extends { id: string; isDeleted: boolean }> implements IBaseCrudService<T> {
  constructor(protected readonly repo: Repository<T>) {}

  async getAll(): Promise<T[]> {
    return this.repo.find({ where: { isDeleted: false } as any });
  }

  async getById(id: string): Promise<T | null> {
    return this.repo.findOne({ where: { id, isDeleted: false } as any });
  }

  async create(dto: any): Promise<T> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity as any);
  }

  async update(id: string, dto: any): Promise<T | null> {
    const existing = await this.getById(id);
    if (!existing) return null;
    Object.assign(existing, dto);
    return this.repo.save(existing);
  }

  async softDelete(id: string): Promise<boolean> {
    const existing = await this.getById(id);
    if (!existing) return false;
    (existing as any).isDeleted = true;
    await this.repo.save(existing);
    return true;
  }

  async getPaged(pagination: PaginationQueryDto): Promise<any> {
    const { pageNumber = 1, pageSize = 10 } = pagination;
    const [items, total] = await this.repo.findAndCount({
      where: { isDeleted: false } as any,
      order: { createdAt: 'DESC' } as any,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
    return { items, pageNumber, pageSize, totalRecords: total };
  }
}