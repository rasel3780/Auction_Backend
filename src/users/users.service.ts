import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt') as {
  hash: (data: string, saltOrRounds: number) => Promise<string>;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const userExists = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ where: { isDeleted: false } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException(`User with ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, isDeleted: false },
    });
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.usersRepository.update(id, { isDeleted: true });

    if (result.affected === 0) {
      throw new NotFoundException(`User with ${id} not found`);
    }
  }

  async UpdateUser(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException(`User with ${id} not found`);
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }
}
