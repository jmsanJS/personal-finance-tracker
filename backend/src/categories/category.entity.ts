import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: string;

  @Column()
  color: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;
}
