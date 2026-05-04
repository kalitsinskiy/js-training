export interface Room {
  id: string;
  name: string;
  ownerId: string;
  code: string;
  members: string[];
}

export interface CreateRoomDto {
  name: string;
  ownerId: string;
}

export interface JoinRoomDto {
  userId: string;
}
