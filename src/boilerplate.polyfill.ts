/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any */
import 'source-map-support/register';

import { compact, map } from 'lodash';
import { Brackets, QueryBuilder, SelectQueryBuilder } from 'typeorm';

import type { AbstractEntity } from './common/abstract.entity';
import type { AbstractDto } from './common/dto/abstract.dto';
import { PageDto } from './common/dto/page.dto';
import { PageMetaDto } from './common/dto/page-meta.dto';
import type { PageOptionsDto } from './common/dto/page-options.dto';
import { VIRTUAL_COLUMN_KEY } from './decorators/virtual-column.decorator';



declare module 'typeorm' {
  interface QueryBuilder<Entity> {
    searchByString(q: string, columnNames: string[]): this;
  }  
  interface QueryBuilder<Entity> {
    searchByDateRange(start_date: Date, end_date: Date,column:string): this;
  }

  interface SelectQueryBuilder<Entity> {
    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
    ): Promise<{ items: Entity[]; pageMetaDto: PageMetaDto }>;
  }
}


declare global {
	interface Array<T> {
	  toDtos<Entity extends AbstractEntity, Dto extends AbstractDto>(
		this: T[],
		options?: any,
	  ): Dto[];
  
	  toPageDto<T extends AbstractEntity, Dto extends AbstractDto>(
		this: T[],
		pageMetaDto: PageMetaDto,
	  ): PageDto<Dto>;
	}
  }

Array.prototype.toPageDto = function (pageMetaDto: PageMetaDto) {
  return new PageDto(this.toDtos(), pageMetaDto);
};

QueryBuilder.prototype.searchByString = function (q, columnNames) {
  if (!q) {
    return this;
  }
  this.andWhere(
    new Brackets((qb) => {
      for (const item of columnNames) {
        qb.orWhere(`${item} LIKE :q`);
      }
    }),
  );

  this.setParameter('q', `%${q}%`);

  return this;
};

QueryBuilder.prototype.searchByDateRange = function (start_date, end_date, column) {
  if (!start_date || !end_date) {
    return this;
  }

  this.andWhere(
    new Brackets((qb) => {
		qb.andWhere(`${column} BETWEEN :start_date AND :end_date`)
    }),
  );

  this.setParameter('start_date', start_date);
  this.setParameter('end_date', end_date);

  return this;
};

SelectQueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
) {
  const selectQueryBuilder = this.skip(pageOptionsDto.skip).take(
    pageOptionsDto.take,
  );
  const itemCount = await selectQueryBuilder.getCount();

  const { entities, raw } = await selectQueryBuilder.getRawAndEntities();

  const items = entities.map((entitiy, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entitiy) ?? {};
    const item = raw[index];

    for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
      entitiy[propertyKey] = item[name];
    }
    return entitiy;
  });

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return { items, pageMetaDto };
};
