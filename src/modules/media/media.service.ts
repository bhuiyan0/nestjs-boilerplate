import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { join, parse } from "path";
import shell from "shelljs"
import fs, { rmdirSync, unlinkSync } from "fs";
import sharp, { FormatEnum } from "sharp";
import { ApiConfigService } from "shared/services/api-config.service";
sharp.cache(false);
@Injectable()
export class MediaService {
	private readonly sizes: string[];
	private readonly server: string;

	constructor(
		private readonly apiConfigService: ApiConfigService
	) {
		this.sizes = ['300X300'];
		this.server = this.apiConfigService.server;
	}

	async createFolder(folder: string): Promise<any> {
		try {
			if(!folder){
				throw new HttpException('Path not specified', HttpStatus.BAD_REQUEST)
			}
			const folder_path = join(process.cwd(),'upload', folder);
			console.log('fullpath ===', folder_path);

			if (fs.existsSync(folder_path)) {
				throw new HttpException('This folder is already exist', HttpStatus.BAD_REQUEST);
			} else {
				// fs.mkdirSync(fullPath);
				shell.mkdir('-p', folder_path);
				return { message: 'Folder successfully created' };
			}
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}
	
	async createSellerFolder(): Promise<any> {
		try {
			const root = join(process.cwd(), 'upload');
			const folder_path = join(process.cwd(),'upload');

			if (!fs.existsSync(root)) {
				fs.mkdirSync(root);
			}

			if (!fs.existsSync(folder_path)) {
				Logger.error('This seller folder is already exists')
				return;
			} else {
				fs.mkdirSync(folder_path);
				return { message: 'Folder successfully created' };
			}
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	async renameFolder(oldPath: string, newName: string): Promise<any> {
		const old_path = join(process.cwd(), 'upload', oldPath);
		const { dir, base } = parse(old_path);
		
		const new_path = join(dir, newName);
		
		if (!fs.existsSync(old_path)) {
			throw new HttpException('This folder does not exist', HttpStatus.BAD_REQUEST);
		}
		if (fs.existsSync(new_path) && newName!==base) {
			throw new HttpException('A folder with the same name already exists', HttpStatus.BAD_REQUEST);
		}

		try {
			fs.renameSync(old_path, new_path);
			return { message: 'Folder has been renamed successfully' };
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	async deleteFileOrFolder(path: string): Promise<any> {
		const fullPath = join(process.cwd(), 'upload', path);
		const isDirectory = await this.isDir(fullPath);

		try {
			if (!fs.existsSync(fullPath)) {
				throw new HttpException('File or directory not found',HttpStatus.BAD_REQUEST);
			}
			if (!isDirectory) {
				const [originalPath, ext] = fullPath.split('.');

				unlinkSync(fullPath);

				for (let i = 0; i < this.sizes.length; i++) {
					const resizedImage = `${originalPath}_${this.sizes[i]}.${ext.toLowerCase()}`;
					if (fs.existsSync(resizedImage)) {
						unlinkSync(resizedImage);
					}
				}
				return { message: 'file successfully deleted' };
			} else {
				rmdirSync(fullPath, { recursive: true });
				return { message: 'folder and its contents deleted' };
			}
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	async getFilePath(fs_path: string): Promise<string> {
		try {
			if (fs.existsSync(fs_path)) {
				return fs_path;
			} else if (fs_path.includes('_')) {
				const [left_part, right_part] = fs_path?.split('_');
				const [, ext] = right_part?.split('.');
				const base_image_path = left_part + '.' + ext;
				return base_image_path;
			} else {
				throw new HttpException('File not found', HttpStatus.NOT_FOUND);
			}
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	async getFilesAndFolders(folder?: string): Promise<any> {
		let shop_path = join(process.cwd(), 'upload');
		const folder_path = !folder ? shop_path : join(shop_path, folder);
		
		if (!fs.existsSync(shop_path)) {
			shell.mkdir(shop_path);
		}
		const folderIconPath = `${this.server}/media/public/secure/folder.png`;
		const imageUrl = !folder ? `${this.server}/media/public` : `${this.server}/media/public/${folder}`;

		try {
			if (!fs.existsSync(folder_path)) {
				throw new HttpException('Folder does not exist', HttpStatus.BAD_REQUEST);
			}
			const files = fs.readdirSync(folder_path, { withFileTypes: true, });

			const folders = files.filter((dirent) => dirent.isDirectory() == true && dirent.name != 'secure')
				.map((folder, index) => ({
					uid: index + 1,
					name: folder?.name,
					status: 'done',
					url: folderIconPath,
					isFolder: true
				}));

			let images = files.filter((dirent) => dirent.isDirectory() == false )
				.sort()
				.map( (image, index) => {
					const fileInfo=  fs.statSync( join(folder_path,image?.name));
					console.log('file info',fileInfo);
					return {
						uid: index + 1,
						name: image?.name,
						status: 'done',
						url: `${imageUrl}/${image?.name}`,
						ext: parse(image?.name).ext,
						ctime:fileInfo?.ctime,
						size: (Math.round(fileInfo?.size/1024)),
					}
				});

			images = images.filter(image => image?.name?.search(/_/) < 0);
			return { folders, images };
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	async uploadImage(image: Express.Multer.File,folder?: string): Promise<any> {
		try {
			const [, ext] = image.filename.split('.');
			
			const url = !folder ? `${this.server}/media/public/${image?.filename}` : `${this.server}/media/public/${folder}/${image?.filename}`;
			await this.saveImages(ext, image, image.path);
			return url;
		} catch (error) {
			throw new HttpException(error.response, error.status);
		}
	}

	async saveImages(ext:keyof FormatEnum | any, file: Express.Multer.File, filepath:string) {
		try {
			if (['jpeg', 'jpg', 'png', 'webp'].includes(ext)) {
				const [originalname] = file.filename.split('.');
				let imgWidth: number;
				let imgHight: number;
	
				const image = sharp(filepath);
				
				image.metadata().then(function (metadata) {
					imgWidth = metadata.width;
					imgHight = metadata.height;
				});
	
				this.sizes?.forEach((s: string,index: number) => {
					const [size] = s.split('X');
					const newFilePath = join(file.destination,originalname + `_${size}X${size}` + '.' + ext.toLowerCase());
					const imgDimantion = parseInt(size);
					if (imgWidth > imgHight) {
						sharp(filepath)
							.resize(imgDimantion, null)
							.toFormat(ext)
							.toFile(newFilePath, function (err) { });
					} else {
						sharp(filepath)
							.resize(null, imgDimantion)
							.toFormat(ext)
							.toFile(newFilePath, function (err) { });
					}
				});
				// resize original image quality
				if (imgWidth > imgHight) {
					const buffer = await sharp(filepath)
						.resize(1000, null)
						.toBuffer();
					sharp(buffer).toFile(filepath);					
				} else {
					const buffer = await sharp(filepath)
						.resize(null, 1000)
						.toBuffer();
					sharp(buffer).toFile(filepath);
				}
			}
		} catch (error) {
			throw new HttpException(error.response, error.status);
		} finally{
			return true;
		}
	}

	async isDir(path: string) {
		try {
			const stat = fs.lstatSync(path);
			return stat.isDirectory();
		} catch (e) {
			// lstatSync throws an error if path doesn't exist
			return false;
		}
	}
}