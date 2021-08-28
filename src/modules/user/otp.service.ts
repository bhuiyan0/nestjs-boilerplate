import { Injectable, HttpException } from "@nestjs/common";
import { RoleService } from "modules/role/role.service";
import { FindConditions } from "typeorm";
import { OtpUpdateDto } from "./dto/otp.dto";
import { Otp } from "./entities/otp.entity";
import { OtpRepository } from "./repositories/otp.repository";


@Injectable()
export class OtpService {
  constructor(
    private otpRepository: OtpRepository,
    private roleService: RoleService,
  ) {}

  async findOne(findData: FindConditions<Otp>): Promise<Otp> {
    try {
      return this.otpRepository.findOne(findData);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async findOtp(
    options: Partial<{ phone?: string; email?: string }>,
  ): Promise<Otp | undefined> {
    const queryBuilder = this.otpRepository.createQueryBuilder('otp');

    if (options.email) {
      queryBuilder.orWhere('otp.user = :email', {
        email: options.email,
      });
    }

    if (options.phone) {
      queryBuilder.orWhere('otp.user = :phone', {
        phone: options.phone,
      });
    }

    return queryBuilder.getOne();
  }

  async create(otp: Otp) {
    try {
      return await this.otpRepository.save(otp);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async update(id: number, otp: OtpUpdateDto) {
    try {
      return await this.otpRepository.update(+id, otp);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
