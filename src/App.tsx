import { useState, useEffect } from "react";
import "./App.css";
import Leaderboard from "./components/leaderboard/Leaderboard";
import Chat from "./components/chat/Chat";
import Settings from "./components/lobby/Settings";
import LoginForm from "./components/lobby/LoginForm";
import RoomList from "./components/lobby/RoomList";
import BgDecor from "./components/lobby/BgDecor";
import GameRoom from "./components/game/GameRoom";
// rooms
import type { Room, User } from "./types";
// tile type
import type { PlacedTile } from "./types";
// for init bunch
import { initRoomBunch, shuffle } from "./components/game/bunch"
// game logic
// import { checkAllTilesConnected, spellCheck } from "./components/game/gameLogic";

const dummyUsers: User[] = [
  {
    id: "u1",
    name: "Alex",
    isBot: false,
    tray: [],
    board: [],
    isReady: true,
  },
  {
    id: "u2",
    name: "Bot",
    isBot: true,
    tray: [],
    board: [],
    isReady: true,
  },
  {
    id: "u3",
    name: "Caro",
    isBot: false,
    tray: [],
    board: [],
    isReady: true,
  },
  {
    id: "u4",
    name: "Dave",
    isBot: false,
    tray: [],
    board: [],
    isReady: true,
  },
  {
    id: "u5",
    name: "Ed",
    isBot: false,
    tray: [],
    board: [],
    isReady: false,
  },
  // {
  //   id: "u6",
  //   name: "Fred",
  //   isBot: false,
  //   tray: [],
  //   board: [],
  //   isReady: true,
  // },
];

// init rooms from this list
const initialRooms: Room[] = [
  { id: 1, priv: false, name: "Solo",        key: "", creator: "", peelCheckEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 2, priv: false, name: "Cavendish",   key: "", creator: "", peelCheckEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 3, priv: false, name: "Plantain",    key: "", creator: "", peelCheckEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 4, priv: false, name: "Goldfinger",  key: "", creator: "", peelCheckEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 5, priv: false, name: "Manzano",     key: "", creator: "", peelCheckEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 6, priv: false, name: "Gros_Michel", key: "", creator: "", peelCheckEnabled: true, botEnabled: true, level: 1, users: dummyUsers, bunch: []},
];
// for testing
initRoomBunch(initialRooms[5]);

// setting default : peelCheckEnabled, botEnabled
// room later needs to read their CURRENT values at creation
export default function App() {
  const [peelCheckEnabled, setpeelCheckEnabled] = useState(true);
  const [botEnabled, setBotEnabled] = useState(true);
  const [level, setLevel] = useState(1);
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  // generated user.id
  const [sessionId] = useState(() => crypto.randomUUID());
  // Rooms
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const currentRoom = rooms.find((r) => r.id === currentRoomId) ?? null;

  // quit room
  function quitRoom(roomId:number) {
    console.log("destroy room:", roomId);
    setRooms((prev) =>
    prev.map((r) => {
      if(r.id !== roomId) return r;

      // remove player and bot if only bot left
      let newUsers = r.users.filter((u) => u.id !== sessionId);
      const isBotOnly = newUsers.length === 1 && newUsers[0].isBot;
      if (isBotOnly) {
        newUsers = newUsers.filter((u) => !u.isBot);
      }
      const isNowEmpty = newUsers.length === 0;

      return {
        ...r,
        users: newUsers,
        ...(isNowEmpty || isBotOnly 
            ? { peelCheckEnabled: false, botEnabled: false, level: 1, priv: false, key: "",creator: "", users: [], bunch: []} 
            : {}),
      };
    }));
    setCurrentRoomId(null);
  }

  // full reset room
  function resetRoom(roomId: number) {
    console.log("room:", roomId, "game finished");
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;

        return {
          ...r,
          peelCheckEnabled: false, botEnabled: false, level: 1, priv: false, key: "",creator: "", users: [], bunch: []};
      })
    );
    setCurrentRoomId(null);
  }

  function backToLobby() {
      console.log("return to lobby");
      setCurrentRoomId(null);
  }

    // init tile count
  function tilesPerPlayer(pc: number): number {
    if (pc <= 4) return 21;
    else return 15;
  }
  // **** for testing : SET ALL to READY ****
    function setUserReady(roomId: number, _sessionId: string, _ready: boolean) {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id !== roomId) return r;

          return {
            ...r,
            users: r.users.map((u) => ({ ...u, isReady: true })),
          };
        })
      );
    }
  // function setUserReady(roomId: number, sessionId: string, ready: boolean) {
  //   setRooms((prev) =>
  //     prev.map((r) => {
  //       if (r.id !== roomId) return r;

  //       return {
  //         ...r,
  //         users: r.users.map((u) =>
  //           u.id === sessionId ? { ...u, isReady: ready } : u
  //         ),
  //       };
  //     })
  //   );
  // }

  // deal tiles for all users once everyone is ready
  function dealTiles(roomId: number) {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;

        const allReady = r.users.length > 0 && r.users.every((u) => u.isReady);
        const alreadyDealt = r.users.some((u) => u.tray.length > 0);
        if (!allReady || alreadyDealt) return r;

        const bunch = [...r.bunch];
        const count = tilesPerPlayer(r.users.length);

        const users = r.users.map((u) => {
          const drawn = bunch.splice(0, count);
          const tray: PlacedTile[] = drawn.map((letter, i) => ({
            x: i,
            y: 0,
            letter,
            id: crypto.randomUUID(),
          }));
          console.log("delt: ", u.name, " tiles :", tray.map(t => t.letter) );
          return { ...u, tray };
        });

        return { ...r, users, bunch };
      })
    );
  }

  const currentRoomAllReady =
    currentRoom !== null &&
    currentRoom.users.length > 0 &&
    currentRoom.users.every((u) => u.isReady);

  const currentRoomAlreadyDealt =
    currentRoom !== null && currentRoom.users.some((u) => u.tray.length > 0);

  useEffect(() => {
    if (!currentRoom) return;
    if (currentRoomAllReady && !currentRoomAlreadyDealt) {
      dealTiles(currentRoom.id);
    }
  }, [currentRoomId, currentRoomAllReady, currentRoomAlreadyDealt]);

  // peel button
  function onPeel(roomId: number) {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        if (r.bunch.length < r.users.length ) return r; // no longer able to distribute 

        const bunch = [...r.bunch];
        const updatedUsers = r.users.map((u) => {
          const letter = bunch.shift(); // take the next letter off the top
          // console.log("bunch now " + bunch);
          if (!letter) return u; // bunch ran out mid-loop

          const newTile: PlacedTile = {
            x: u.tray.length, // append to the end of their tray
            y: 0,
            letter,
            id: crypto.randomUUID(),
          };
          console.log("Peel!: ", u.name, " got: ", newTile.letter);
          return { ...u, tray: [...u.tray, newTile] };
        });

        return { ...r, users: updatedUsers, bunch };
      })
    );
  }

  // drop on Dump
  function onDump(roomId: number, tileId: string) {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        if (r.bunch.length < 3) return r; // not enough left 

        const userIndex = r.users.findIndex((u) => u.id === sessionId);
        if (userIndex === -1) return r;

        const user = r.users[userIndex];
        //search tray and board for ddraged tile
        const trayTile = user.tray.find((t) => t.id === tileId);
        const boardTile = trayTile ? undefined : user.board.find((t) => t.id === tileId);
        const dumpedTile = trayTile ?? boardTile;
        if (!dumpedTile) return r

        // return the letter to the bunch and shuffle it back in
        const bunch = shuffle([...r.bunch, dumpedTile.letter]);
        const drawn = bunch.splice(0, 3);
        const newTiles: PlacedTile[] = drawn.map((letter) => ({
          x: 0,
          y: 0,
          letter,
          id: crypto.randomUUID(),
        }));

        const newTray: PlacedTile[] = (
          trayTile ? user.tray.filter((t) =>t.id !== tileId) :  user.tray
        )
          .concat(newTiles)
          .map((t,i) => ({ ...t, x: i }));

        const newBoard: PlacedTile[] = boardTile
          ? user.board.filter((t) => t.id !== tileId)
          : user.board;

        const updatedUsers = [...r.users];
        updatedUsers[userIndex] = { ...user, tray: newTray, board: newBoard };

        console.log("Dump: ", user.name, " dumped ", dumpedTile.letter, " for ", drawn);
        console.log("bunch reshuffled to :", bunch);
        return { ...r, users: updatedUsers, bunch };
      })
    );
  }
  // drop on Board
  function onPlacingBoard(roomId: number, tileId: string, x: number, y: number) {
    setRooms((prev) =>
      prev.map((r) => {
        if (x < 0 || x > 29 || y < 0 || y > 16) return r;
        if (r.id !== roomId) return r;

        const userIndex = r.users.findIndex((u) => u.id === sessionId);
        if (userIndex === -1) return r;

        const user = r.users[userIndex];
        //search tray and board for ddraged tile
        const trayTile = user.tray.find((t) => t.id === tileId);
        const boardTile = trayTile ? undefined : user.board.find((t) => t.id === tileId);
        const pickedTile = trayTile ?? boardTile;
        if (!pickedTile) return r

        const newTray: PlacedTile[] =
          trayTile 
          ? user.tray.filter((t) =>t.id !== tileId) 
          : user.tray

        const boardWithoutTile: PlacedTile[] = 
          boardTile
          ? user.board.filter((t) => t.id !== tileId)
          : user.board;
        
        const newBoard = boardWithoutTile.concat({
          ...pickedTile,
          x:x,
          y:y,
        });

        const updatedUsers = [...r.users];
        updatedUsers[userIndex] = { ...user, tray: newTray, board: newBoard };

        console.log(user.name, " placed tile: ", pickedTile.letter, " to ", x, " * ", y);
        return { ...r, users: updatedUsers };
      })
    );
  }

  // drop on Tray
  function onPlacingTray(roomId: number, tileId: string) {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;

        const userIndex = r.users.findIndex((u) => u.id === sessionId);
        if (userIndex === -1) return r;

        const user = r.users[userIndex];
        //search tray and board for ddraged tile
        const trayTile = user.tray.find((t) => t.id === tileId);
        const boardTile = trayTile ? undefined : user.board.find((t) => t.id === tileId);
        const pickedTile = trayTile ?? boardTile;
        if (!pickedTile) return r

        const trayWithoutTile: PlacedTile[] =
          trayTile 
          ? user.tray.filter((t) =>t.id !== tileId) 
          : user.tray

        const newBoard: PlacedTile[] = 
          boardTile
          ? user.board.filter((t) => t.id !== tileId)
          : user.board;
        
        const newTray = [...trayWithoutTile, pickedTile].map((t, i) => ({
        ...t, x: i, y: 0,
       }));

        const updatedUsers = [...r.users];
        updatedUsers[userIndex] = { ...user, tray: newTray, board: newBoard };

        console.log(user.name, " placed tile: ", pickedTile.letter, " to the end of tray");
        return { ...r, users: updatedUsers };
      })
    );
  }

  return (
    <div className="background">
      <Leaderboard />
      <Settings
        peelCheckEnabled={peelCheckEnabled}
        onTogglePeel={() => setpeelCheckEnabled(!peelCheckEnabled)}
        botEnabled={botEnabled}
        onToggleBot={() => setBotEnabled(!botEnabled)}
        level={level}
        onLevelClick={() => {
          if (!botEnabled) return;
          setLevel(level >= 3 ? 1 : level + 1);
        }}
      />
      <LoginForm 
        userName={userName}
        setUserName={setUserName}
        passWord={passWord}
        setPassWord={setPassWord}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
      <RoomList 
        rooms={rooms}
        setRooms={setRooms}
        initialRooms={initialRooms}
        peelCheckEnabled={peelCheckEnabled} 
        botEnabled={botEnabled} 
        level={level} 
        isLogin={isLogin}
        userName={userName}
        sessionId={sessionId}
        onEnterRoom={(room) => setCurrentRoomId(room.id)}
      />
      <Chat 
        userName={userName}
        isLogin={isLogin}
      />

      {/* room select render */}
      {currentRoom === null ? (
          <BgDecor />
      ) : (
        <GameRoom
          room={currentRoom}
          sessionId={sessionId}
          onBack={backToLobby}
          onQuit={() => quitRoom(currentRoom.id)}
          onWin={() => resetRoom(currentRoom.id)}
          onSetUserReady={(ready: boolean) => setUserReady(currentRoom.id, sessionId, ready)}
          onPeel={() => onPeel(currentRoom.id)}
          onDump={(tileId: string) => onDump(currentRoom.id, tileId)}
          onPlacingBoard={(tileId: string, x: number, y: number) => onPlacingBoard(currentRoom.id, tileId, x, y)}
          onPlacingTray={(tileId: string) => onPlacingTray(currentRoom.id, tileId)}
        />
      )}
    </div>
  );
}
