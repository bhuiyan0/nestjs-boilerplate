import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiTag } from 'common/constants/api-tag';

import { version } from '../package.json';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('API')
    .setVersion(version)
    .addBearerAuth();
	for (let tag in ApiTag) {
		options.addTag(ApiTag[tag]);
	}
    const api = options.build();

  const document = SwaggerModule.createDocument(app, api);
  SwaggerModule.setup('doc', app, document);
}
