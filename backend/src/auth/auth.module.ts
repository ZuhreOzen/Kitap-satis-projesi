import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Bunu ekledik
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity'; // User entity'sini çağırdık

@Module({
  // TypeOrmModule.forFeature([User]) eklenmeli ki Repository enjekte edilebilsin
  imports: [TypeOrmModule.forFeature([User])], 
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}