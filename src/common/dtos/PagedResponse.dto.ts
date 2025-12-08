import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PagedResponseDto<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;

  constructor(items: T[], pageNumber: number, pageSize: number, totalRecords: number) {
    this.items = items;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalRecords = totalRecords;
  }
}