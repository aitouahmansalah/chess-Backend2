import { IsNotEmpty, IsString, IsUUID, IsInt, IsObject } from 'class-validator';
export class GameCreateDto{

    
    @IsNotEmpty()
    winnerId: string;
  
    
    @IsNotEmpty()
    loserId: string;
  
    @IsInt()
    @IsNotEmpty()
    moves: number;
  
    @IsObject()
    @IsNotEmpty()
    gameState: Record<string, any>;


}