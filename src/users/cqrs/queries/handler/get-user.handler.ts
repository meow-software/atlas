import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { GetUserQuery } from '../get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
    private CACHE_TTL = 300;
    constructor(private prisma: PrismaService, private redis: RedisService) { }

    async execute(query: GetUserQuery) {
        const { id, full } = query;
        const key = `user:${id}`;
        if (!full) {
            const cached = await this.redis.get(key);
            if (cached) return JSON.parse(cached);
        }
        const select = full
            ? { id: true, username: true, email: true, bio: true, avatar_url: true, createdAt: true, deleted: true }
            : { id: true, username: true, avatar_url: true, createdAt: true, deleted: true };
        const user = await this.prisma.user.findUnique({ where: { id }, select });
        if (!full && user) await this.redis.set(key, JSON.stringify(user), this.CACHE_TTL);
        return user;
    }
}
