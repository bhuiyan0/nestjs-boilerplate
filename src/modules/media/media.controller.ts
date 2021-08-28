import { Res, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query, UploadedFile, UseInterceptors, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { join, parse } from 'path';
import { diskStorage } from 'multer';
import * as sharp from 'sharp';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MediaService } from './media.service';
sharp.cache(false);
import { Response } from 'express';
import { AuthUser } from 'decorators/auth-user.decorator';
import { User } from 'modules/user/entities/user.entity';
import { Auth } from 'decorators/http.decorators';
import { RoleType } from 'common/constants/role-type';

@Controller('media')
export class MediaController {

	constructor(
		private readonly mediaService: MediaService
	) { }

	// get all files  and folders in a folder
	@Get('public/:path(*+)')
	@ApiOperation({ tags: ['Media'], summary: 'public api to get a image by a specific path.' })
	async getImage(@Res() res: Response, @Param('path') path:string): Promise<any> {
		const root = join(process.cwd(), '/upload');
		const file_path = !path ? root : join(root, path);

		const image_path = await this.mediaService.getFilePath(file_path);
		res.sendFile(image_path, (error: any) => {
			if (error) {
				throw new HttpException('Something went wrong', HttpStatus.NOT_FOUND);
			}
		})
	}

	// get all files  and folders in root folder
	@Get()
	@ApiOperation({ tags: ['Media'], summary: 'Get a files and folders of root path.' })
	@ApiBearerAuth()
	@Auth(RoleType.ADMIN)
	async get(): Promise<any> {
		return await this.mediaService.getFilesAndFolders()
	}

	// get all files and folders in a folder
	@Get(':path(*+)')
	@ApiOperation({ tags: ['Media'], summary: 'Get files and folders by a specific path.' })
	@ApiBearerAuth()
	@Auth(RoleType.ADMIN)
	async getByPath(@Param('path') path:string): Promise<any> {
		return await this.mediaService.getFilesAndFolders(path)
	}

	// delete a directory or an image by its path
	@Delete(':path(*+)')
	@ApiOperation({ tags: ['Media'], summary: 'delete a image or folder from the server' })
	@ApiBearerAuth()
	@Auth(RoleType.ADMIN)
	async delete(@Param('path') path:string) {
		return await this.mediaService.deleteFileOrFolder(path);
	}

	// create a folder in upload directory
	@Post('folder/create')
	@ApiOperation({ tags: ['Media'], summary: 'create a folder' })
	@ApiBearerAuth()
	@Auth(RoleType.ADMIN)
	async createFolder(@Query('path') path:string): Promise<any> {
		return await this.mediaService.createFolder(path)
	}

	// rename a folder
	@Post('folder/rename')
	@ApiOperation({ tags: ['Media'], summary: 'rename a folder' })
	@ApiBearerAuth()
	@Auth(RoleType.ADMIN)
	async renameFolder(@Query() { oldpath, newname }) {
		return await this.mediaService.renameFolder(oldpath, newname);
	}


	// upload an image 
	@Post('upload')
	@ApiOperation({ tags: ['Media'], summary: 'upload image to server' })
	@ApiBearerAuth()
	@Auth(RoleType.ADMIN)
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage({
			destination: (req, file, callback) => {
				try {
					const folder = req.query?.folder;

					if (!file) {
						throw new HttpException('file not specified', HttpStatus.BAD_REQUEST)
					}

					const root = join(process.cwd(), '/upload');
					const dest = !folder ? root : join(root, folder.toString());

					console.log('destination', dest);

					// if(!fs.existsSync(dest)){
					// 	throw new HttpException('Folder does not exist', HttpStatus.BAD_REQUEST)
					// }

					callback(null, dest);
				} catch (err) {
					throw new HttpException(err.response, err.status);
				}
			},
			filename: (req, file, cb) => {
				try {
					let [originalname, ext] = file.originalname.split('.');
					const [, fileType] = file.mimetype.split('/');
					if (
						['jpeg', 'jpg', 'png', 'webp'].includes(fileType.toLowerCase()) &&
						['jpeg', 'jpg', 'png', 'webp'].includes(ext.toLowerCase())
					) {
						ext == 'jpg' ? (ext = 'jpeg') : (ext = ext);
						const randomName = parse(file.originalname).name.replace(/[_() ]/g, '-') + Date.now() + `.${ext.toLowerCase()}`;

						console.log('random name', randomName);

						return cb(null, randomName);
					} else {
						throw new HttpException('Invalid Image Format, must be either jpeg, png, jpg or webp', HttpStatus.BAD_REQUEST);
					}
				} catch (err) {
					throw new HttpException(err.response, err.status);
				}
			},
		}),
		limits:{ 
			fileSize:1024*1024
		}
	}),
	)
	async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
		return await this.mediaService.uploadImage(file, folder);
	}

}
