import { AbstractEntity } from 'common/abstract.entity';
import { Role } from 'modules/role/entities/role.entity';
import { User } from 'modules/user/entities/user.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Permission extends AbstractEntity {
  
  @Column({ unique: true, nullable: false, type: 'varchar', length: 50 })
  name: string;

  @Column({ nullable: true, type: 'varchar', length: 200 })
  description: string;

  @Column()
  group: string;

  @ManyToMany(() => User, (user) => user.permissions)
  users: User[];

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

}
