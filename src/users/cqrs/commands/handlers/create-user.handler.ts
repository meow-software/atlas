
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserCommand } from '../create-user.command';
import * as eventBusInterface from 'src/lib';
import { ConflictException } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private prisma: PrismaService, private eventBus: eventBusInterface.IEventBus) {}

  async execute(command: CreateUserCommand) {
    // let user = await  this.prisma.user.findUnique({ where: { email : command.email } });
    // if (user) return new ConflictException("User already exists");

    // can be create
    let user = await this.prisma.user.create({
      data: {
        username: command.username,
        email: command.email,
        password: command.password,
      },
    });

    await this.eventBus.publish('user.created', {
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return user;
  }
}
