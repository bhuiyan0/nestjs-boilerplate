import { Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

@Injectable()
export class GeneratorService {
	public uuid(): string {
		return uuid();
	}

	public fileName(ext: string): string {
		return this.uuid() + '.' + ext;
	}


	/**
	 * generate hash from password or string
	 * @param {string} password
	 * @returns {string}
	 */
	static generateHash(password: string): string {
		return bcrypt.hashSync(password, 10);
	}

	/**
	 * generate random string
	 * @param length
	 */
	 static generateRandomString(length: number): string {
		return Math.random()
			.toString(36)
			.replace(/[^\dA-Za-z]+/g, '')
			.slice(0, Math.max(0, length));
	}

	/**
		 * generate slug
		 * @param title
		 */
	 static generateSlug(title: string): string {
		let slug = title
			.toString()
			.toLowerCase()
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(
				/['"<>@+?.,\/#!$%\^&\*;:{}=\_`~()©®℗™℃℉§‡⁑⁂‰⁈‱⁒⁍⁌ª⁊^µ♪※¸¶±é½]/g,
				'-',
			)
			.replace(/\-\-+/g, '-') // Replace multiple - with single -
			.replace(/^-+/, '') // Trim - from start of text
			.replace(/-+$/, ''); // Trim - from end of text

		slug = slug + '-' + String(Date.now());
		return slug;
	}

	
	/**
	 * generate random number
	 * @param length
	 */
	 static generateRandomNumber(length: number): number {
		const [a, b] = [10 ** (length - 1), 10 ** (length - 1) * length];
		return Math.floor(a + Math.random() * b);
	}

	/**
	 * generate random number
	 * @param min
	 * @param max
	 */
	 static generateNumberByRange(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}



}
