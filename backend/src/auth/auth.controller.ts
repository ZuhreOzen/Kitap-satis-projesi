import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // DTO'yu çağırdık

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) { // 'any' yerine 'LoginDto' kullandık
    return this.authService.login(loginDto.username, loginDto.password);
  }

  // Kayıt olma fonksiyonunu buraya ekleyebilirsin
  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }
}