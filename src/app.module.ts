import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';
import { AuditService } from './audit/audit.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    RedisService,
    AuditService,
  ],
  exports: [
    PrismaService,
  ]
})
export class AppModule {}
