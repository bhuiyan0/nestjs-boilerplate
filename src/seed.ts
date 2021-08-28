import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'filters/all-exception.filter';
import { Logger } from '@nestjs/common';
import { RoleService } from 'modules/role/role.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalFilters(new AllExceptionsFilter());

	const roleService = app.get(RoleService);

	await roleService.seedRoles()  // seeding user roles 

	await app.close();
}

bootstrap().then(() => {
	Logger.warn('seeding complete...');
});
