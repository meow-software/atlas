import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { AuditService } from 'src/audit/audit.service';
import { UpdateUserHandler } from './cqrs/commands/handlers/update-user.handler';
import { GetUserHandler } from './cqrs/queries/handler/get-user.handler';

@Module({
  controllers: [UsersController],
  providers: [
    PrismaService,
    RedisService,
    AuditService,
    UpdateUserHandler,
    GetUserHandler,
  ]
})
export class UsersModule {}
