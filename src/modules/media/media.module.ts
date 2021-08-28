import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    MulterModule.register({
      // dest: 'upload',
    }),
  ],
  controllers: [MediaController],
  providers:[MediaService],
  exports: [MediaService]
})
export class MediaModule {}
