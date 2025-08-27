
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import * as eventBusInterface from 'src/event-bus/event-bus.interface';
import { DeleteUserCommand } from '../delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private prisma: PrismaService, private eventBus: eventBusInterface.IEventBus) {}

  async execute(command: DeleteUserCommand) {
    const user = await this.prisma.user.delete({ where: { id: command.id } });

    await this.eventBus.publish('user.deleted', { id: user.id });

    return user;
  }
}
