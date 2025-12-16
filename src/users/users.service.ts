import {
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { IUsersService } from './interfaces/users-service.interface';
import { UserEntity } from './user.entity';
import { MediaService } from 'src/media/media.service';
import * as fs from 'fs';
import * as path from 'path';
import { MediaType } from 'src/media/media.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService
  extends BaseService<UserEntity>
  implements IUsersService {
  constructor(
    @InjectRepository(UserEntity)
    repo: Repository<UserEntity>,
    private mediaService: MediaService,
  ) {
    super(repo);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email, isDeleted: false } });
  }

  async uploadProfilePicture(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    if (!file) throw new BadRequestException('No file uploaded');

    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, GIF allowed');
    }


    const user = await this.repo.findOne({ where: { id: userId, isDeleted: false } });
    if (!user) {
      throw new BadRequestException('User not found');
    }


    const oldMedia = await this.mediaService.findProfilePictureByUserId(userId);
    if (oldMedia) {
      const oldPath = path.join(process.cwd(), 'uploads', oldMedia.url.replace('/uploads/', ''));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      await this.mediaService.deleteMedia(oldMedia.id);
    }


    const uploadsDir = path.join(process.cwd(), 'uploads', 'profile_pictures');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = `${userId}_${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const url = `/uploads/profile_pictures/${fileName}`;

    await this.mediaService.createMedia(
      url,
      MediaType.PROFILE_PICTURE,
      userId,
      null,
      file.originalname,
      file.size,
      file.mimetype,
    );

    user.profilePic = url;
    await this.repo.save(user);

    return url;
  }
}
