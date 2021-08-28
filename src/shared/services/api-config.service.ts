import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserSubscriber } from 'entity-subscribers/user.subscriber';
import { SnakeNamingStrategy } from '../../snake-naming.strategy';

@Injectable()
export class ApiConfigService {
	constructor(private configService: ConfigService) { }

	get isDevelopment(): boolean {
		return this.nodeEnv === 'development';
	}

	get isProduction(): boolean {
		return this.nodeEnv === 'production';
	}

	public getNumber(key: string): number {
		return Number(this.configService.get(key));
	}

	public getBoolean(key: string): boolean {
		const value= this.configService.get(key)?.trim();
		return value && value =='true' ? true : false;
	}

	private getString(key: string, defaultValue?: string): string {
		const value = this.configService.get(key, defaultValue);
		if (!value) {
			return;
		}
		return value.toString().replace(/\\n/g, '\n');
	}

	get nodeEnv(): string {
		return this.getString('NODE_ENV', 'development');
	}

	get fallbackLanguage(): string {
		return this.getString('FALLBACK_LANGUAGE').toLowerCase();
	}

	get server(): string {
		return this.nodeEnv === 'development'
			? `http://localhost:${this.getString('PORT')}`
			: `${this.getString('API_SERVER_URL')}`;
	}

	get typeOrmConfig(): TypeOrmModuleOptions {
		let entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}'];
		// let subscribers = [__dirname + '/../../entity-subscribers/*.subscriber{.ts,.js}'];
		let subscribers = [UserSubscriber];
		let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];
		
		if (module.hot) {
			const entityContext = require.context(
				'./../../modules',
				true,
				/\.entity\.ts$/,
			);
			entities = entityContext.keys().map((id) => {
				const entityModule = entityContext(id);
				const [entity] = Object.values(entityModule);
				return entity as string;
			});
			const migrationContext = require.context(
				'./../../migrations',
				false,
				/\.ts$/,
			);

			migrations = migrationContext.keys().map((id) => {
				const migrationModule = migrationContext(id);
				const [migration] = Object.values(migrationModule);
				return migration as string;
			});
		}
		
		return {
			entities,
			migrations,
			keepConnectionAlive: true,
			autoLoadEntities: true,
			type: 'mysql',
			host: this.getString('DB_HOST'),
			port: this.getNumber('DB_PORT'),
			username: this.getString('DB_USERNAME'),
			password: this.getString('DB_PASSWORD'),
			database: this.getString('DB_DATABASE'),
			subscribers,
			migrationsRun: true,
			synchronize: this.getBoolean('DB_SYNC') || false,
			logging: this.isDevelopment,
			namingStrategy: new SnakeNamingStrategy(),
		};
	}

	get authConfig() {
		return {
			jwtSecret: this.getString('JWT_SECRET_KEY'),
			jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
		};
	}

	get appConfig() {
		return {
			port: this.getString('PORT'),
		};
	}
}
