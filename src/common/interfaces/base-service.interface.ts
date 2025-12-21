import { PaginationQueryDto } from '../dtos/PaginationQuery.dto';

export interface ServiceResult<T> {
  isSuccess: boolean;
  code: number;
  message?: string;
  data?: T;
}

export interface PagedResult<T> {
  items: ServiceResult<T[]>;
  totalCount: number;
}

export interface IBaseService<
  T extends {
    id: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt?: Date | null;
  },
> {

  getAll(): Promise<ServiceResult<T[]>>;

  getById(id: string): Promise<ServiceResult<T>>;

  create(entity: T): Promise<ServiceResult<T>>;

  update(id: string, partialEntity: Partial<T>): Promise<ServiceResult<T>>;

  softDelete(id: string): Promise<ServiceResult<boolean>>;

  getPaged(query: PaginationQueryDto): Promise<PagedResult<T>>;
}
