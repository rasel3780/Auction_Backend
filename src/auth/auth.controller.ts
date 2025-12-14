import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from 'src/users/users.service';
import { ApiResponse, ok, fail } from '../common/helper/api-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../jwt/jwt.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    @Post('login')
    async login(@Body() dto: LoginDto): Promise<ApiResponse<{ accessToken: string }>> {
        const userExist = await this.usersService.findByEmail(dto.email);

        if (!userExist) {
            return fail('email not found', 404);
        }

        const match = await bcrypt.compare(dto.password, userExist.password);
        if (!match) {
            return fail('wrong password', 401)
        }

        const accessToken = await this.jwtService.generateToken({
            id: userExist.id,
            email: userExist.email,
        });

        return ok({ accessToken }, 200);
    }
}