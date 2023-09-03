import { UserType } from "@src/types";
import {
  GameRoomInfoType,
  MatchHistoryType,
  GameRoomType,
} from "@src/types/game.type";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();
export const matchHistoryState = atom<MatchHistoryType[]>({
  key: "matchHistoryState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const gameRoomIn = atom<boolean>({
  key: "gameRoomIn",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const gameRoomInfoState = atom<GameRoomInfoType>({
  key: "gameRoomInfoState",
  default: {
    roomURL: "",
    roomName: "",
    roomType: "" as GameRoomType,
    roomPassword: "",
    homeUser: {} as UserType,
    awayUser: {} as UserType,
    homeReady: false,
    awayReady: false,
  },
  effects_UNSTABLE: [persistAtom],
});

export const gameRoomListState = atom<GameRoomInfoType[]>({
  key: "gameRoomListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
