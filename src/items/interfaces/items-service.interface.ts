import { IBaseService } from 'src/common/interfaces/base-service.interface';
import { ItemEntity } from '../item.entity';

/**
 * Items service interface extending base CRUD operations
 */
export interface IItemsService extends IBaseService<ItemEntity> {
  // Add any item-specific methods here
}
