import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
  } from '@nestjs/common'
import { GamesService } from './game.service';
import { GameCreateDto } from './dto';

@Controller('game')
export class GameController{

constructor(private game:GamesService){}

@Post()
  async create(@Body() createDto: GameCreateDto) {
    return this.game.createGame(createDto.winnerId, createDto.loserId, createDto.moves, createDto.gameState);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.game.getGameById(parseInt(id, 10));
  }

  @Get('user/:id')
  async findByUser(@Param('id') id: string) {
    return this.game.getGamesByUser(id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.game.deleteGame(parseInt(id, 10));
  }

}