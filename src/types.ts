// tile
export interface PlacedTile {
  x: number;
  y: number;
  letter: string;
  id: string;
}

// user data / player
export interface User {
  id: string;   // generated once
  name: string; // userName or Guest_${sessionId.slice(0, 4)}
  isBot: boolean;
  tray: PlacedTile[];
  board: PlacedTile[];
  isReady: boolean;
}

// room data
export interface Room {
  id: number;       // 1 - 6, (id 1 = Solo)
  priv: boolean;    // priv: whether the room is password protected (shows a lock icon).
  name: string;     // room name
  key: string;      // room key
  creator: string;  // room creator username

  peelEnabled: boolean;
  botEnabled: boolean;
  level: number;

  users: User[]; // max 6 users bot count as 1
  bunch: string[];
}