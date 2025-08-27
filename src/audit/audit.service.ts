import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Snowflake } from 'src/lib';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(userId: Snowflake | null, action: string, payload: any = {}) {
    await this.prisma.auditLog.create({ data: { userId, action, payload }});
  }
}
