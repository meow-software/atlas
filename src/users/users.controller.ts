import { Controller, Get, Param, UseGuards, Patch, Body, Delete, Req, Query, Post, Inject } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from './cqrs/queries/get-user.query';
import { UpdateUserCommand } from './cqrs/commands/update-user.command';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUsersQuery } from './cqrs/queries/search-users.query';
import { DeleteUserCommand } from './cqrs/commands/delete-user.command';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserCommand } from './cqrs/commands/create-user.command';
import { SearchUsersDto } from './dto/search-users.dto';

@Controller('users')
export class UsersController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) { }

    @Post()
    async create(@Body() dto: CreateUserDto) {
        return this.commandBus.execute(
            new CreateUserCommand(dto.username, dto.email, dto.password),
        );
    }
    @Patch('me')
    async patchMe(@Req() req, @Body() dto: UpdateUserDto) {
        // Todo use guard, jwt redis for get id
        return this.commandBus.execute(new UpdateUserCommand(req.user.id, dto));
    }



    @Get(':id')
    async getPublic(@Param('id') id: string) {
        return this.queryBus.execute(new GetUserQuery(id, false));
    }

    @Delete('me')
    async deleteMe(@Req() req) {
        // Todo use guard, jwt redis for get id
        return this.commandBus.execute(new DeleteUserCommand(req.user.id));
    }

    @Get('me')
    async getMe(@Req() req) {
        // Todo use guard, jwt redis for get id
        return this.queryBus.execute(new GetUserQuery(req.user.id, true));
    }

    @Get()
    async search(@Query() query: SearchUsersDto) {
        return this.queryBus.execute(new SearchUsersQuery(query.term));
    }
}
