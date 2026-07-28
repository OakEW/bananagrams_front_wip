// tile
export interface PlacedTile {
  x: number;
  y: number;
  letter: string;
}

// user data
export interface User {
  id: string; // generated once and match to name if a user login
  name: string;
  isBot: boolean;
  // isMyself: boolean;
  tray: PlacedTile[];
  board: PlacedTile[];
}

// room data.
export interface Room {
  id: number;       // 1 - 6, (id 1 = Solo)
  // pc: number;       // 0 - 6 player count. bot count // as 1 now users[]handle this
  priv: boolean;    // priv: whether the room is password protected (shows a lock icon).
  active: boolean;  // active: whether the current user has a game running in this room.
  name: string;     // room name
  key: string;      // room key
  creator: string;  // room creator username

  peelEnabled: boolean;
  botEnabled: boolean;
  level: number;

  users: User[];
  bunch: string[];
}