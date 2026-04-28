import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartItem } from './entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  controllers: [CartController],
  providers: [CartService],
  //exports: [CartService], // YAGNI prensibi gereği şu an ihtiyaç olmadığı için yoruma alındı.
})
export class CartModule {}