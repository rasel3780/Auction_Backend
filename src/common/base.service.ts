import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PaginationQueryDto } from './dtos/PaginationQuery.dto';
import {
  IBaseService,
  PagedResult,
  ServiceResult,
} from './interfaces/base-service.interface';

@Injectable()
export abstract class BaseService<
  T extends {
    id: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt?: Date | null;
  },
> implements IBaseService<T> {
  constructor(protected readonly repo: Repository<T>) { }

  async getAll(): Promise<ServiceResult<T[]>> {
    try {
      const data = await this.repo.find({
        where: { isDeleted: false } as FindOptionsWhere<T>,
        order: { createdAt: 'DESC' } as any,
      });

      return { isSuccess: true, data, code: 200 };
    } catch (error) {
      return { isSuccess: false, code: 500, message: error.message };
    }
  }

  async getById(id: string): Promise<ServiceResult<T>> {
    try {
      const data = await this.repo.findOne({
        where: { id, isDeleted: false } as FindOptionsWhere<T>,
      });

      if (!data)
        return { isSuccess: false, code: 404, message: 'Entity not found' };

      return { isSuccess: true, data, code: 200 };
    } catch (error) {
      return { isSuccess: false, code: 500, message: error.message };
    }
  }

  async create(entity: T): Promise<ServiceResult<T>> {
    try {
      const created = this.repo.create(entity);
      const saved = await this.repo.save(created);
      return { isSuccess: true, data: saved, code: 201 };
    } catch (error) {
      return { isSuccess: false, code: 500, message: error.message };
    }
  }

  async update(id: string, partialEntity: Partial<T>): Promise<ServiceResult<T>> {
    try {
      const existing = await this.repo.findOne({
        where: { id, isDeleted: false } as FindOptionsWhere<T>,
      });

      if (!existing) {
        return { isSuccess: false, code: 404, message: 'Entity not found' };
      }


      Object.assign(existing, partialEntity, { updatedAt: new Date() });

      const updated = await this.repo.save(existing);
      return { isSuccess: true, data: updated, code: 200 }; // ← 200, not 201
    } catch (error) {
      return { isSuccess: false, code: 500, message: error.message };
    }
  }

  async softDelete(id: string): Promise<ServiceResult<boolean>> {
    try {
      const existing = await this.repo.findOne({
        where: { id, isDeleted: false } as FindOptionsWhere<T>,
      });

      if (!existing)
        return { isSuccess: false, code: 404, message: 'Entity not found' };

      existing.isDeleted = true;

      await this.repo.save(existing);

      return { isSuccess: true, data: true, code: 200 };
    } catch (error) {
      return { isSuccess: false, code: 500, message: error.message };
    }
  }

  async getPaged(query: PaginationQueryDto): Promise<PagedResult<T>> {
    try {
      const { pageNumber, pageSize } = query;
      const skip = (pageNumber - 1) * pageSize;

      const [data, totalCount] = await this.repo.findAndCount({
        where: { isDeleted: false } as FindOptionsWhere<T>,
        skip,
        take: pageSize,
        order: { createdAt: 'DESC' } as any,
      });

      return {
        items: { isSuccess: true, data, code: 200 },
        totalCount,
      };
    } catch (error) {
      return {
        items: { isSuccess: false, code: 500, message: error.message },
        totalCount: 0,
      };
    }
  }
}
