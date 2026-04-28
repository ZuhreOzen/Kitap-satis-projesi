import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(username: string, pass: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    
    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Giriş başarısız! Bilgileri kontrol edin.');
    }

    return {
      userId: user.id,
      username: user.username,
      role: user.role,
    };
  }

  // Kayıt olma fonksiyonu (Yeni eklendi)
  // auth.service.ts içindeki register metodu:
  async register(registerDto: any) {
    const existingUser = await this.userRepository.findOne({ 
      where: { username: registerDto.username } 
    });
    if (existingUser) throw new ConflictException('Bu kullanıcı adı alınmış.');

    // KESİN KURAL: Dışarıdan kayıt olan herkes ZORUNLU olarak CUSTOMER'dır.
    // registerDto.role gelse bile onu eziyoruz. (Güvenlik ve Clean Code)
    const newUser = this.userRepository.create({
      username: registerDto.username,
      password: registerDto.password,
      role: 'CUSTOMER' 
    });
    return await this.userRepository.save(newUser);
  }
}