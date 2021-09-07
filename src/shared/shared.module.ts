import { Global, HttpModule, Module, CacheModule } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './services/redis-cache.service';
import { NotificationService } from './services/notification.service';
import { GeneratorService } from './services/generator.service';

const providers = [ApiConfigService, RedisCacheService,NotificationService,GeneratorService];
@Global()
@Module({
	providers,
	imports: [
		HttpModule,
		CacheModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				store: redisStore,
				host: configService.get('REDIS_HOST'),
				port: configService.get('REDIS_PORT'),
				ttl: configService.get('CACHE_TTL'),
				max: configService.get('MAX_ITEM_IN_CACHE')
			})
		})
	],
	exports: [...providers, HttpModule],
})
export class SharedModule { }
