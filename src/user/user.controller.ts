import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ParsedUrlQuery } from 'querystring'
import { JwtGuard } from 'src/auth/guards'
import { GetUser } from 'src/user/decorators'
import { UpdateUserDto } from './dto'
import { UserService } from './user.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('users')
export class UserController {
  constructor(private user: UserService) {}


  @Get('token/:token')
  getUserBytoken(
    @Param('token') token: string,
  ) {
    return this.user.getUserByToken(token);
  }

  @Get('id/:id')
  getUserById(
    @Param('id') id: string,
  ) {
    return this.user.getUserById(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('image')) 
  async uploadAvatar(@UploadedFile() file, @Param('id') userId: string) {
    return this.user.uploadAvatar(userId, file);
  }

  @Get(':username')
  getUserAndStuff(
    @Param('username') username: string,
    @Query() query: ParsedUrlQuery,
  ) {
    return this.user.getUserAndStuff(username, query)
  }

  @Get()
  getMultipleUsers(@Query() query: ParsedUrlQuery) {
    return this.user.getMultipleUsers(query)
  }

  @UseGuards(JwtGuard)
  @Patch()
  updateUser(@GetUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.user.updateUser(userId, dto)
  }

  @UseGuards(JwtGuard)
  @Delete()
  deleteUser(@GetUser('id') userId: string) {
    return this.user.deleteUser(userId)
  }

  @UseGuards(JwtGuard)
  @Patch(':username/follow')
  followOrUnfollowUser(
    @GetUser('id') userId: string,
    @Param('username') targetUsername: string,
  ) {
    return this.user.followOrUnfollowUser(userId, targetUsername)
  }
}
