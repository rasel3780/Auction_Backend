import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';


@Injectable()
export class JwtService {
    constructor(private readonly jwt: NestJwtService) { }

    async generateToken(user: { id: string; email: string }) {
        const payload = {
            sub: user.id,
            email: user.email,
            jti: crypto.randomUUID(),
            iat: Math.floor(Date.now() / 1000),
        };
        return this.jwt.signAsync(payload, { expiresIn: '15m' });
    }
}
