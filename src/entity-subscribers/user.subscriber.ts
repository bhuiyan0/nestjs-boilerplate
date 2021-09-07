import { User } from 'modules/user/entities/user.entity';
import { GeneratorService } from 'shared/services/generator.service';
import type {EntitySubscriberInterface,InsertEvent, UpdateEvent} from 'typeorm';
import { EventSubscriber } from 'typeorm';
import { UtilsProvider } from '../providers/utils.provider';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo(): typeof User {
    return User;
  }

  beforeInsert(event: InsertEvent<User>): void {	  
    if (event.entity.password) {
      event.entity.password = GeneratorService.generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<User>): void {
    if (event.entity.password && event.entity.password !== event.databaseEntity.password) {
      event.entity.password = GeneratorService.generateHash(event.entity.password);
    }
  }
}
