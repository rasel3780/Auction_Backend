import {
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { IUsersService } from './interfaces/users-service.interface';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService
  extends BaseService<UserEntity>
  implements IUsersService {
  constructor(
    @InjectRepository(UserEntity)
    repo: Repository<UserEntity>,
  ) {
    super(repo);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email, isDeleted: false } });
  }
}
