import { User } from 'src/modules/users/entities/user.enitity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

enum StatusColor {
  success = 'success',
  warning = 'warning',
  danger = 'danger',
  info = 'info',
}

export enum StatusName {
  pending = 'pending',
  active = 'active',
  inactive = 'inactive',
  incomplete = 'incomplete',
}

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ type: 'enum', enum: StatusColor, default: StatusColor.warning })
  color: string;

  @Column({ type: 'enum', enum: StatusName, default: StatusName.pending })
  value: string;

  @OneToMany(() => User, (user) => user.status)
  users: User[];
}
