export enum UserStatusType {
  ONLINE,
  GAME,
  OFFLINE,
  SIGNUP,
}

export enum ChatChannelType {
  PUBLIC,
  PROTECTED,
  PRIVATE,
}

export interface TMP {
  id?: string;
}

export enum UserRelationType {
  FRIEND,
  BLOCK,
}

export interface ValidNicknameType {
  message: string;
  status: number;
}
