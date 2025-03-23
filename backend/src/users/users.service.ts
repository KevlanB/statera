import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    // Verifica se a senha está definida
    if (!user.password) {
      throw new BadRequestException('Password is required');
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Cria um novo usuário com a senha criptografada
    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<Partial<User>[]> {
    // console.log('Buscando todos os usuários...');
    const users = await this.usersRepository.find();
    return users.map(user => {
      const { password, ...result } = user; // Remove a senha do objeto de retorno
      return result;
    });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}