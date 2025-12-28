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

    verify(token: string): { sub: string; email: string; jti: string; iat: number; exp: number } {
        try {
            return this.jwt.verify(token);
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}

