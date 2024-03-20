import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { GameModule } from './games/game.module'
import { FileInterceptor, MulterModule } from '@nestjs/platform-express'
import { multerConfig } from './multer.config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';



@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PostModule,
    CommentModule,
    GameModule,
    MulterModule.register(multerConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'uploads'), 
      serveRoot: '/uploads', 
    }),
  ],
  providers: [{
    provide: APP_INTERCEPTOR,
      useClass: FileInterceptor('image')},
  ],
  controllers: [],
})
export class AppModule {}
