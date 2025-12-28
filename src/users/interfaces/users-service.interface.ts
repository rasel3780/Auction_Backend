import { IBaseService } from 'src/common/interfaces/base-service.interface';
import { UserEntity } from '../user.entity';

export interface IUsersService extends IBaseService<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
}
