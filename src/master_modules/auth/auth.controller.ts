import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/common/dto/common.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Master Auth")
@Controller('master/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  loginAdmin(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto);
  }
}
