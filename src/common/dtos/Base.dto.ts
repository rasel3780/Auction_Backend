export abstract class BaseDto {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  isDeleted?: boolean;
}
