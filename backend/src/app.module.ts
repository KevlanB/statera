import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Order } from './orders/order.entity';
import { OrdersModule } from './orders/orders.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { StripeModule } from './stripe/stripe.module';
import { CheckoutModule } from './stripe/checkout.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis de ambiente acessíveis globalmente
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Order, User],
      synchronize: true, // Em produção, é recomendado setar como false e usar migrações
    }),
    OrdersModule,
    AuthModule,
    UsersModule,
    StripeModule,
    CheckoutModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
