export class PagedResponseDto<T> {
  constructor(
    public items: T[],
    public pageNumber: number,
    public pageSize: number,
    public totalRecords: number,
  ) {}
}
