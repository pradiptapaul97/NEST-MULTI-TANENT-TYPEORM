import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/common/dto/common.dto';
import { HelperService } from 'src/helper/helper.service';
import { UserRepository } from 'src/tenant_modules/user/repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenRepository } from 'src/tenant_modules/refresh-token/repository/refresh-token.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly helperService: HelperService,
        private readonly configService: ConfigService,
        private readonly refreshTokenRepository: RefreshTokenRepository
    ) { }

    async generateAccessToken(payload: any): Promise<string> {
        return this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRY') || '15m',
        });
    }

    async generateRefreshToken(payload: any): Promise<string> {
        return this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRY') || '7d',
        });
    }

    async verifyAccessToken(token: string): Promise<any> {
        return this.jwtService.verify(token, {
            secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        });
    }

    async verifyRefreshToken(token: string): Promise<any> {
        return this.jwtService.verify(token, {
            secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        });
    }

    // async loginAdmin(loginDto: LoginDto) {

    //     let userData = await this.userRepository.getByField({
    //         email: loginDto.email,
    //         isDeleted: false
    //     });

    //     if (!userData?.id) {
    //         throw new UnauthorizedException('INVALID_CREDENTIALS_ERROR');
    //     }

    //     let passMatch = await this.helperService.comparePassword(loginDto.password, userData.password);

    //     if (!passMatch) {
    //         throw new UnauthorizedException('INVALID_CREDENTIALS_ERROR');
    //     }

    //     const payload = { sub: userData.id, email: userData.email };

    //     const accessToken = await this.generateAccessToken(payload);
    //     const refreshToken = await this.generateRefreshToken(payload);


    //     delete userData.password;
    //     delete userData.status;
    //     delete userData.isDeleted;

    //     return { data: userData, token: accessToken, message: `Login success` };
    // }
}
