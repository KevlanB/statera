import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() order: Partial<Order>): Promise<Order> {
    return this.ordersService.create(order);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Order | null> {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() order: Partial<Order>): Promise<Order | null> {
    return this.ordersService.update(id, order);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.ordersService.remove(id);
  }
}
