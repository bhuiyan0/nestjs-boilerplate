import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ApiConfigService } from "./api-config.service";
import * as nodemailer from 'nodemailer'
import { MailDto } from "common/dto/mail.dto";

@Injectable()
export class NotificationService {
	constructor(
		private readonly apiConfigService: ApiConfigService
	) { }

	async sendMail({ to, subject, body }: MailDto): Promise<any> {
		try {
			const options = {
				service: 'gmail',
				auth: {
					type: 'Auth2',
					user: this.apiConfigService.getString('GMAIL_USER'),
					pass: this.apiConfigService.getString('GMAIL_PASS')
				}
			}

			let message = {
				from: this.apiConfigService.getString('GMAIL_USER'),
				to,
				subject: subject,
				html: 'Hello World'
			}
			let transporter = nodemailer.createTransport(options);

			// verify connection configuration
			transporter.verify(function (error, success) {
				if (error) {
					console.log(error);
					throw new BadRequestException('verify connection configuration failed')
				} else {
					console.log("Server is ready to take our messages");
				}
			});
			const info = await transporter.sendMail(message);

			if(info?.accepted?.length){
				return 'email successfully sent';
			}else{
				throw new InternalServerErrorException('Something went wrong');
			}
	
		} catch (error) {
			throw new HttpException(error.response, error.status)
		}

	}
}