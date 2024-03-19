import { Global, Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { JwtService } from '@nestjs/jwt'

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService,JwtService],
})
export class UserModule {}
