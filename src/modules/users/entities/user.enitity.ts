import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { IsOptional, IsString } from 'class-validator';

export type AuthMethod = 'email' | 'google';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: 'email' })
  authMethod: AuthMethod;

  @Column({ nullable: true })
  language: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  password: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  picture: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.authMethod === 'google') {
      this.password = null;
    } else {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
      this.googleId = null;
    }
  }
}

export type hiddenFields =
  | 'password'
  | 'googleAccessToken'
  | 'googleRefreshToken'
  | 'emailVerificationToken'
  | 'emailVerificationTokenExpiresAt'
  | 'passwordResetToken'
  | 'passwordResetTokenExpiresAt';

export const hiddenFields: hiddenFields[] = [
  'password',
  'googleAccessToken',
  'googleRefreshToken',
  'emailVerificationToken',
  'emailVerificationTokenExpiresAt',
  'passwordResetToken',
  'passwordResetTokenExpiresAt',
];
