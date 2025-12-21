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
        try {
            if (!dto.email || !dto.password) {
                return fail('Email and password are required', 400);
            }

            const userExist = await this.usersService.findByEmail(dto.email);
            if (!userExist || !userExist.password) {
                return fail('Invalid credentials', 401);
            }

            // 🔍 Log for debugging
            console.log('User found:', userExist.email);
            console.log('Password hash length:', userExist.password?.length);

            const match = await bcrypt.compare(dto.password, userExist.password);
            if (!match) {
                return fail('Invalid credentials', 401);
            }

            const accessToken = await this.jwtService.generateToken({
                id: userExist.id,
                email: userExist.email,
            });

            return ok({ accessToken }, 200);
        } catch (error) {
            console.error('Login error:', error); // ← SEE REAL ERROR
            return fail('Login failed', 500);
        }
    }
}