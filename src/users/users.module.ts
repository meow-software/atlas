import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/services/prisma.service';
import { RedisService } from 'src/services/redis.service';
import { UpdateUserHandler } from './cqrs/commands/handlers/update-user.handler';
import { GetUserHandler } from './cqrs/queries/handler/get-user.handler';
import { SnowflakeService } from 'src/services/snowflake.service';
import { EventBusModule } from 'src/event-bus/event-bus.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule, 
    EventBusModule
  ],
  controllers: [UsersController],
  providers: [
    PrismaService,
    RedisService,
    SnowflakeService,
    UpdateUserHandler,
    GetUserHandler,
  ]
})
export class UsersModule {}
