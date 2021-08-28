import { AbstractEntity } from 'common/abstract.entity';
import { Permission } from 'modules/permission/entities/permission.entity';
import { Role } from 'modules/role/entities/role.entity';
import { Entity, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from 'typeorm';
@Entity()
export class User extends AbstractEntity {
	@Column({ nullable: true, type: 'varchar', length: 50 })
	name: string;

	@Column({ unique: true, nullable: true,type: 'varchar',length: 50 })
	email: string;

	@Column({ unique: true, nullable: true, type: 'varchar', length: 50})
	phone: string;

	@Column({ nullable: true, type: 'boolean', default: false })
	isEmailUnSubscribed: boolean;

	@Column({ nullable: true, type: 'boolean', default: false })
	isPhoneUnSubscribed: boolean;

	@Column({ unique: true, nullable: true, type:'varchar', length: 20})
	userName: string;

	@Column({ nullable: false, type: "varchar"})
	password: string;

	@Column({ nullable: false, type: 'boolean', default: false })
	isEmailVerified: boolean;

	@Column({ nullable: false, type: 'boolean', default: false })
	isPhoneVerified: boolean;

	@ManyToOne(() => Role, (role) => role.users)
	@JoinColumn()
	role: Role;

	@ManyToMany(() => Permission, (per) => per.users)
	@JoinTable({name:'user_vs_permission'})
	permissions: Permission[];
}
