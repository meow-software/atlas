import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(userId: number | null, action: string, payload: any = {}) {
    await this.prisma.auditLog.create({ data: { userId, action, payload }});
  }
}
