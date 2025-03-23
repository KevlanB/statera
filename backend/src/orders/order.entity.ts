import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client: string;

  @Column('json')
  items: object[];

  @Column('decimal')
  total: number;

  @Column({
    type: 'enum',
    enum: ['pendente', 'pago', 'cancelado'],
    default: 'pendente',
  })
  status: 'pendente' | 'pago' | 'cancelado';
}
