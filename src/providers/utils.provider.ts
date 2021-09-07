import bcrypt from 'bcrypt';

export class UtilsProvider {
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
}
