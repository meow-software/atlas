import { Controller, Get, Param, UseGuards, Patch, Body, Delete, Req, Query, Post, Inject } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from './cqrs/queries/get-user.query';
import { UpdateUserCommand } from './cqrs/commands/update-user.command';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get(':id')
  async getPublic(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserQuery(+id, false));
  }

  @Get('me')
  async getMe(@Req() req) {
    return this.queryBus.execute(new GetUserQuery(req.user.id, true));
  }

  @Patch('me')
  async patchMe(@Req() req, @Body() dto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(req.user.id, dto));
  }

  @Delete('me')
  async deleteMe(@Req() req) {
    return this.commandBus.execute(new DeleteUserCommand(req.user.id));
  }

  @Get()
  async search(@Query('username') username: string) {
    return this.queryBus.execute(new SearchUserQuery(username));
  }
}
