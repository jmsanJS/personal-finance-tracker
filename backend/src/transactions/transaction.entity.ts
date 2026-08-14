import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (v: number) => v,
      from: (v: string) => parseFloat(v),
    },
  })
  amount!: number;

  @Column({ nullable: true })
  description!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type!: string;

  @ManyToOne(() => Category)
  category!: Category;

  @Column()
  categoryId!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
