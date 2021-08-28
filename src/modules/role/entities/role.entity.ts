import { AbstractEntity } from 'common/abstract.entity';
import { Permission } from 'modules/permission/entities/permission.entity';
import { User } from 'modules/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Role extends AbstractEntity {
	@Column({ unique: true, type: 'varchar', length: 30 })
	title: string;

	@Column({ unique: true, type: 'varchar', length: 255 })
	description: string;



	@OneToMany(() => User, (user) => user.role)
	users: User[];

	@ManyToMany(() => Permission, (per) => per.roles)
	@JoinTable({ name: 'role_vs_permission' })
	permissions: Permission[];
}
