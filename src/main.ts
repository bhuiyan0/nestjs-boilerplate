import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import compression from 'compression';
import RateLimit from 'express-rate-limit';
import { AllExceptionsFilter } from 'filters/all-exception.filter';
import helmet from 'helmet';
import { logger } from 'middlewares/logger.middleware';
import morgan from 'morgan';
import { setupSwagger } from 'swegger';
import { useContainer } from 'class-validator';

import {
	initializeTransactionalContext,
	patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { AuthUserInterceptor } from 'interceptors/auth-user.interceptor';
import { RedisCacheService } from 'shared/services/redis-cache.service';

export async function bootstrap(): Promise<NestExpressApplication> {
	initializeTransactionalContext();
	patchTypeORMRepositoryWithBaseRepository();
	const app = await NestFactory.create<NestExpressApplication>(
		AppModule,
		new ExpressAdapter(),
		{ cors: true },
	);

	app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	app.use(helmet());
	//   app.use(logger);
	app.use(
		RateLimit({
			windowMs: 2 * 60 * 1000, // 15 minutes
			max: 200, // limit each IP to 100 requests per windowMs
		}),
	);
	app.use(compression());
	//   app.use(morgan('combined'));

	// it's for custom validators e.g. unique, match validator
	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	const reflector = app.get(Reflector);
	app.useGlobalFilters(new AllExceptionsFilter());
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new AuthUserInterceptor())
	app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

	const configService = app.select(SharedModule).get(ApiConfigService);
	const cacheManager = app.select(SharedModule).get(RedisCacheService);

	await app.startAllMicroservicesAsync();

	if (['development', 'staging'].includes(configService.nodeEnv)) {
		setupSwagger(app);
	}

	const port = configService.appConfig.port;
	await app.listen(port);

	Logger.log(`server running on port ${port}`);

	return app;
}

void bootstrap();
