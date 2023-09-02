import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export type GameRoomType = 'PUBLIC' | 'PROTECTED' | 'PRIVATE' | 'QUICK' | ''; // QUICK은 대전 신청 혹은 랭킹전에서 사용 (PROTECTED의 사용법과 동일하다면 향후 통합)

export interface GameRoom {
  roomURL: string;
  roomName: string;
  roomType: GameRoomType;
  roomPassword: string;
  homeUser: User;
  awayUser: User;
  homeReady: boolean;
  awayReady: boolean;
}

@Injectable()
export class GameService {
  private rooms: GameRoom[] = [];

  createGameRoom(gameRoom: GameRoom): void {
    this.rooms.push(gameRoom);
  }

  getAllGameRooms(): GameRoom[] {
    return this.rooms;
  }
}
