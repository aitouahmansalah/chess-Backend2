import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PrismaClient,  Game, User } from '@prisma/client';
import { GameCreateDto } from './dto';

@Injectable()
export class GamesService {

    constructor(private prisma:DatabaseService){}

    async createGame(winnerId: string, loserId: string, moves: number, gameState: any): Promise<Game> {
        const gameData: GameCreateDto = {
          winnerId,
          loserId,
          moves,
          gameState
        };
        const game = await this.prisma.game.create({ data: gameData });
        return game;
      }
    
      async updateGame(id: number, data: GameCreateDto): Promise<Game> {
        const game = await this.prisma.game.update({ where: { id }, data });   
        return game;
      }
    
      async getGameById(id: number): Promise<Game | null> {
        const game = await this.prisma.game.findUnique({ where: { id },include: {
            winner: true,
            loser: true
          } });
        return game;
      }
    
      async deleteGame(id: number): Promise<Game | null> {
        const game = await this.prisma.game.delete({ where: { id } });
        return 
      }
    
      async getGamesByUser(userId: string): Promise<Game[]> {
        const games = await this.prisma.game.findMany({
          where: {
            OR: [
              { winnerId: userId },
              { loserId: userId }
            ]
          },
          include: {
            winner: true,
            loser: true
          }
        });
        return games;
      }
}
