import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { BooksModule } from './books/books.module'; 
import { UsersModule } from './users/users.module'; 
import { DemoModule } from './demo/demo.module';   

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', 
      password: '12345', 
      database: 'Kitap_Satisi',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    AuthModule,
    CartModule,
    BooksModule, 
    UsersModule, 
    DemoModule,  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}