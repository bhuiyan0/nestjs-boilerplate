import { IsNotEmpty } from 'class-validator';
import { AbstractEntity } from 'common/abstract.entity';
import { Column, Entity } from 'typeorm';
@Entity()
export class Otp extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  user: string; // email or phone number

  @Column({type:'int', nullable: false })
  code: number; //  4 digit one time pin 
}
