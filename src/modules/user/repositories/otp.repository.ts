import { EntityRepository, Repository } from 'typeorm';
import { Otp } from '../entities/otp.entity';

@EntityRepository(Otp)
export class OtpRepository extends Repository<Otp> {}
