# bananagrams

lobby and game page, React + TypeScript + Vite.

## Setup
1. Install dependencies:
   ```
   npm install
   ```

2. Run the dev server:
   ```
   npm run dev
   ```
   Then open the URL it prints (http://localhost:5173).

## data structure memo
A reference for how `Room`, `users`, `bunch`, and `tray` move through the app.

### state ownership

| Data | Type | Owner | File |
|---|---|---|---|
| `rooms` | `Room[]` | `App.tsx` | `App.tsx` |
| `room.bunch` | `string[]` | inside each `Room` | `App.tsx` |
| `room.users` | `User[]` | inside each `Room` | `App.tsx` |
| `user.tray` | `PlacedTile[]` | inside each `User` | `App.tsx` |
| `user.board` | `PlacedTile[]` | inside each `User` | `App.tsx` |
| `currentRoomId` | `number \| null` | `App.tsx` | `App.tsx` |
| `sessionId` | `string` | `App.tsx` generated once via `crypto.randomUUID()` | `App.tsx` |

### Layer map

```
App.tsx                   owns: rooms, currentRoomId, sessionId
  ├─ setUserReady()       mutates: user.isReady
  ├─ dealTiles()          mutates: room.bunch, user.tray
  ├─ onPeel()             mutates: room.bunch, user.tray
  ├─ onDump()             mutates: room.bunch, user.tray *wip
  ├─ quitRoom()           mutates: room.users, room.  
  │                         bunch (resets to [] on empty/bot-only)
  └─ resetRoom()          mutates: entire room back to defaults

RoomButton.tsx            room icon buttons

RoomKeyBox.tsx            room key input unit

RoomList.tsx              calls setRooms directly 
  └─ joinRoom()           mutates: room.users (adds player/bot)
                          calls initRoomBunch() in empty room

bunch.tsx                 helper
  └─ initRoomBunch(room)

LoginForm.tsx             fetch username and password

Settings.tsx              fetch setting infos (bot & peel)

RoomKeyBox.tsx            read-only on Room; decides button state 
                            (join/resume/disabled)
GameRoom.tsx -> Game.tsx  read-only on Room; render tray/board

Tile.tsx
```

## WIP
- onDump
- drag and drop
- winning condition check (board check, fetch words)
- Peel! Dump! Banana! visualization
- leaderboard / game history
- login verification (now is a dummy lives in LoginForm.tsx)
- user info display / chat (to be decided)