import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './services/prisma.service';
import { RedisService } from './services/redis.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SnowflakeService } from './services/snowflake.service';
import { RedisEventBus } from './event-bus/redis-event-bus';
import { EventBusModule } from './event-bus/event-bus.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    EventBusModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    RedisService,
    SnowflakeService
  ],
  exports: [
    PrismaService,
    RedisService,
    SnowflakeService
  ]
})
export class AppModule { }
