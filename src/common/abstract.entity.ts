import { UtilsProvider } from 'providers/utils.provider';
import { PrimaryGeneratedColumn, CreateDateColumn, Column, UpdateDateColumn } from 'typeorm';
import { AbstractDto } from './dto/abstract.dto';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: number;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false, default: true })
  isDeleted: boolean;
}
