import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoleType } from 'common/constants/role-type';
import { User } from 'modules/user/entities/user.entity';
import { Connection, FindConditions } from 'typeorm';
import { RoleCreateDto } from './dto/role-create.dto';
import { Role } from './entities/role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
	constructor(
		private roleRepository: RoleRepository,
		private connection: Connection,
	) { }

	findOne(findData: FindConditions<Role>): Promise<Role> {
		try {
			return this.roleRepository.findOne(findData);
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}
	async create(role: RoleCreateDto) {
		try {
			// return this.roleRepository.save(role)
			// return await this.connection.getCustomRepository(RoleRepository).save(role)
			return await this.connection.getRepository(Role).save(role);
		} catch (error) { }
	}

	async findOneByName(roleName: string): Promise<Role> {
		return await this.roleRepository.findOne({ title: roleName });
	}


	async getAll() {
		try {
			return await this.roleRepository.createQueryBuilder('role').getMany();
			// return await this.connection.getRepository(Role).count();
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	getById(id: number) {
		try {
			return this.roleRepository.findOne(id);
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	// seeding role data
	async seedRoles() {
		for (const key in RoleType) {
			if (Object.prototype.hasOwnProperty.call(RoleType, key)) {
				const element = RoleType[key];
				const isExist = await this.findOneByName(element);
				if (!isExist) {
					let role = new Role();
					role.title = element;
					await this.roleRepository.save(role);
				}
			}
		}
		
	}
}
