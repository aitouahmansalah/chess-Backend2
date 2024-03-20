import { Global, Module } from '@nestjs/common'
import { GamesService } from './game.service';
import { GameController } from './game.controller';


@Global()
@Module({
  controllers: [GameController],
  providers: [GamesService],
})
export class GameModule {}
