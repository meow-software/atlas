import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/services/prisma.service';
import { RedisService } from 'src/services/redis.service';
import { GetUserQuery } from '../get-user.query';
import { SnowflakeService } from 'src/services/snowflake.service';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
    private CACHE_TTL = 300;
    constructor(private prisma: PrismaService, private snowflake: SnowflakeService, private redis: RedisService) { }

    async execute(query: GetUserQuery) {
        let { id, full } = query;
        const key = `user:${id}`;
        if (!full) {
            const cached = await this.redis.get(key);
            if (cached) return JSON.parse(cached);
        }

        let _id = this.snowflake.toBigInt(id);
        const select = full
            ? { id: true, username: true, email: true, bio: true, avatar_url: true, createdAt: true, deleted: true }
            : { id: true, username: true, avatar_url: true, createdAt: true, deleted: true };
        const user = await this.prisma.user.findUnique({ where: { id: _id }, select });
        if (!full && user) await this.redis.set(key, JSON.stringify(user), this.CACHE_TTL);
        return user;
    }
}
