import bcrypt from 'bcrypt';

export class UtilsProvider {

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
	 * validate text with hash
	 * @param {string} password
	 * @param {string} hash
	 * @returns {Promise<boolean>}
	 */
	static validateHash(password: string, hash: string): Promise<boolean> {
		if (!password || !hash) {
			return Promise.resolve(false);
		}
		return bcrypt.compare(password, hash);
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
}
