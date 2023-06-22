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

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  emailVerificationTokenExpiresAt: Date;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetTokenExpiresAt: Date;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  googleAccessToken: string;

  @Column({ nullable: true })
  googleRefreshToken: string;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    if (this.authMethod === 'google') {
      this.password = null;
    } else {
      this.googleId = null;
      this.googleAccessToken = null;
      this.googleRefreshToken = null;
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
