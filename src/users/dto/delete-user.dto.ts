
import * as lib from 'src/lib';
import { IsString, Length } from 'class-validator';

export class DeleteUserDto {
    @IsString()
    @Length(18)
    id: lib.Snowflake;
}