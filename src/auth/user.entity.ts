import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from '../../node_modules/bcrypt';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  //Eager is just one side
  @OneToMany((type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @Column()
  id: number;

  async validatePassword(testPassword: string): Promise<boolean> {
    const hashTestPassword = await bcrypt.hash(testPassword, this.salt);
    return this.password === hashTestPassword;
  }
}
