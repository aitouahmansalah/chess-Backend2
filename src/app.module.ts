import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { GameModule } from './games/game.module'



@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PostModule,
    CommentModule,
    GameModule
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
