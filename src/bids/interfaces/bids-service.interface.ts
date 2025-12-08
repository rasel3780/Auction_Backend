import { IBaseService } from 'src/common/interfaces/base-service.interface';
import { BidEntity } from '../bid.entity';

/**
 * Bids service interface extending base CRUD operations
 */
export interface IBidsService extends IBaseService<BidEntity> {
  // Add any bid-specific methods here
}
