
import { Injectable, HttpException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { RoleType } from 'common/constants/role-type';
import { Role } from 'modules/role/entities/role.entity';
import { RoleService } from 'modules/role/role.service';
import { UtilsProvider } from 'providers/utils.provider';
import { FindConditions, Not } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';

import { UserCreateDto, UserUpdateDto } from './dto/user.dto';
import { UserLoginDto } from './dto/UserLoginDto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
	constructor(
		private userRepository: UserRepository,
		private roleService: RoleService,
	) { }

	findOne(findData: FindConditions<User>): Promise<User> {
		try {
			return this.userRepository.findOne(findData);
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	async findForJwt(id: number): Promise<User> {
		try {
			const user = await this.userRepository.createQueryBuilder('user')
				.leftJoin('user.seller', 'seller')
				.leftJoinAndSelect('user.role', 'role')
				.select(['user.id', 'user.email', 'user.phone', 'user.name', 'user.username', 'user.isVerified', 'user.phoneSubscribed', 'user.emailSubscribed'])
				.addSelect(['seller.id', 'seller.shopId', 'seller.title', 'seller.slug', 'seller.phone', 'seller.email'])
				.addSelect(['role.id', 'role.name'])
				.where('user.id = :id', { id })
				.getOne();

			return user;
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	async findUser(options: Partial<{ username?: string; email?: string; phone?: string }>, isSeller: boolean = false): Promise<User | undefined> {
		try {
			const queryBuilder = this.userRepository.createQueryBuilder('user');

			if (options?.email) {
				queryBuilder.orWhere('user.email = :email', { email: options.email });
			}
			if (options?.username) {
				queryBuilder.orWhere('user.username = :username', { username: options.username });
			}
			if (options?.phone) {
				queryBuilder.orWhere('user.phone = :phone', { phone: options.phone });
			}
			queryBuilder.addSelect(['user.id','user.name', 'user.email','user.phone','user.password','user.username'])

			if (isSeller) {
				queryBuilder.leftJoin('user.seller', 'seller')
				queryBuilder.addSelect(['seller.id','seller.title', 'seller.email', 'seller.slug','seller.phone'])
			}
			return await queryBuilder.getOne();
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	async create(body: UserCreateDto): Promise<User | undefined> {
		try {
			if (!body?.email && body?.phone) {
				throw new BadRequestException('email or phone is not provided');
			}
			let role = await this.roleService.findOne({ title: RoleType.USER });
			if (!role) {
				let roleObj=new Role()
				roleObj.title = RoleType.USER;
				roleObj.description = 'User role';
				role = await this.roleService.create(roleObj)
			}
			body.role = role;
			console.log('role found', body.role);

			const user = await this.findUser({ email: body?.email, phone: body?.phone });
			console.log('user found', user);

			if (!user) {
				if (body?.roleId) {
					const role2 = await this.roleService.findOne({ id: body?.roleId });
					role2 && (body.role = role2);
				}

				return await this.userRepository.save(body)
			}
			const duplidate_value = user && (user?.email == body?.email ? 'email' : user?.phone == body?.phone ? 'phone' : 'username');

			if (duplidate_value) {
				throw new BadRequestException(`${duplidate_value} is already in use`);
			}
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	async update2(id: number, body: UserUpdateDto): Promise<User> {
		try {
			body.role = await this.roleService.findOne({ title: RoleType.USER });
			const user = await this.userRepository.findOne(id);
			if (!user) {
				throw new NotFoundException('User not found');
			}
			if (user?.isEmailVerified) {
				delete body?.email;
			}
			if (user?.isPhoneVerified) {
				delete body?.phone;
			}
			let qb = this.userRepository.createQueryBuilder('user')
			if (body?.phone) {
				qb.where('user.phone = :phone', { phone: body?.phone })
			}
			if (body?.email) {
				qb.andWhere('user.email = :email', { email: body?.email })
			}
			qb.andWhere('user.id != :id', { id: id })
			let user_exist = await qb.getOne();

			if (!user_exist) {
				if (body.roleId) {
					body.role = await this.roleService.findOne({ id: body?.roleId });
				}

				const user_instance = this.userRepository.merge(user, body);
				return await this.userRepository.save(user_instance);
			}
			const duplidate_value = user_exist && user_exist?.email == body?.email ? 'email' : 'phone';

			if (duplidate_value) {
				throw new BadRequestException(`${duplidate_value} is already in use`);
			}
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	async update(id: number, body: UserUpdateDto) {
		try {
			const user = await this.userRepository.findOne(id);
			if (!user) {
				throw new NotFoundException('User not found');
			}

			user?.isEmailVerified && delete body?.email;
			user?.isPhoneVerified && delete body?.phone;

			// unique email and phone validate
			if (body?.email) {
				const is_email_exists = await this.userRepository.findOne({ where: { email: body?.email, id: Not(id) } });
				if (is_email_exists) {
					throw new BadRequestException('Email is already in use by  another user')
				}
			}

			if (body?.phone) {
				const is_phone_exists = await this.userRepository.findOne({ where: { phone: body?.phone, id: Not(id) } });
				if (is_phone_exists) {
					throw new BadRequestException('Phone is already in use by  another user')
				}
			}
			//@ts-ignore
			body.id = id;
			const updatedUser = await this.userRepository.save(body);
			return await this.getUser(updatedUser.id)
		} catch (error) {
			throw new HttpException(error.response, error.status)
		}
	}

	async changePassword(id: number, body: ChangePasswordDto) {
		try {
			const user = await this.userRepository.findOne(id);

			if (!user) {
				throw new NotFoundException('User not found');
			}

			const validate = await UtilsProvider.validateHash(body?.currentPassword, user?.password)
			if (!validate) {
				throw new BadRequestException('Old password is invalid');
			}
			//@ts-ignore
			body.id = id;
			await this.userRepository.save(body)
			return await this.getUser(id);
		} catch (error) {
			throw new HttpException(error.response, error.status)
		}
	}

	//admin: get all users 
	async getUser(id?: number): Promise<User | User[]> {
		console.log('id', id);

		try {
			const qb = this.userRepository.createQueryBuilder('user')
				.leftJoin('user.role', 'role')
				.select(['user.name', 'user.email', 'user.phone', 'user.id', 'role.name', 'role.id'])
			// .addSelect(['role.id','role.name'])
			if (id) {
				qb.where('user.id = :id', { id: id })
				const user = await qb.getOne();
				if (!user) {
					throw new NotFoundException('User not found');
				}
				return user;
			}

			return await qb.getMany();
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}



	async createDefaultUser() {
		const role = await this.roleService.findOneByName(RoleType.SUPER_ADMIN);
		if (role) {
			const defaultAdmin: any = {
				name: 'Admin',
				username: 'admin',
				password: '123456',
				confirmPassword: '123456',
				role,
				email: 'admin@mail.com',
			};

			// Create the default admin user if it doesn't already exist.
			const user = await this.findUser(defaultAdmin);
			if (!user) {
				await this.create(defaultAdmin);
			}
		} else {
			Logger.error('admin role not found');
		}
	}

	async findOneValidate(user: UserLoginDto): Promise<User> {
		try {
			const qb = this.userRepository.createQueryBuilder('user')
				.leftJoin('user.role', 'role')
				.leftJoin('user.seller', 'seller')
				.select(['name', 'email', 'password', 'role', 'seller', 'username', 'phone'])
			if (user?.email) {
				qb.orWhere('user.email = :email', { email: user?.email })
			}
			if (user?.phone) {
				qb.orWhere('user.phone = :phone', { phone: user?.phone })
			}
			if (user?.username) {
				qb.orWhere('user.username = :username', { username: user?.username })
			}
			return await qb.getOne();
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}



}
