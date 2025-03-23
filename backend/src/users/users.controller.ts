import { Controller, Post, Body, Get, Param, UseGuards, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async findOne(@Param('username') username: string): Promise<User | null> {
    return this.usersService.findOne(username);
  }

  @UseGuards(JwtAuthGuard) 
  @Get()
  async findAll(): Promise<Partial<User>[]> {
    // console.log('Requisição recebida em GET /users');
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
      return this.usersService.remove(id);
    }
}