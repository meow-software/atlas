import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../update-user.command';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { Inject } from '@nestjs/common';
import * as eventBusInterface from 'src/event-bus/event-bus.interface';
import { AuditService } from 'src/audit/audit.service';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  private CACHE_TTL = 300;
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    @Inject(eventBusInterface.IEventBusToken) private eventBus: eventBusInterface.IEventBus,
    private audit: AuditService,
  ) {}

  async execute(command: UpdateUserCommand) {
    const { userId, dto } = command;
    const user = await this.prisma.user.update({ where: { id: userId }, data: dto });
    // invalidate cache
    await this.redis.del(`user:${userId}`);
    // audit
    await this.audit.log(userId, 'user.updated', { fields: Object.keys(dto) });
    // publish event
    await this.eventBus.publish('user.updated', {
      id: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
      fields: Object.keys(dto),
    });
    return user;
  }
}
