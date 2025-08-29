import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckLoginBotQuery } from '../check-login-bot.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

@QueryHandler(CheckLoginBotQuery)
export class CheckLoginBotHandler implements IQueryHandler<CheckLoginBotQuery> {
    constructor(private botsRepo: PrismaService) { }

    async execute(query: CheckLoginBotQuery): Promise<boolean> {
        const { id, token } = query;
        const repository = await this.botsRepo.bots

        const bot = await repository.findFirst({
            where: { id: id, token: token },
            include: { user: true }
        });

        if (!bot) throw new UnauthorizedException('Invalid bot credentials.');
        return bot;
    }
}
