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
import { initRoomBunch } from "./components/game/bunch"

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
  { id: 1, priv: false, name: "Solo",        key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 2, priv: false, name: "Cavendish",   key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 3, priv: false, name: "Plantain",    key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 4, priv: false, name: "Goldfinger",  key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 5, priv: false, name: "Manzano",     key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 6, priv: false, name: "Gros_Michel", key: "", creator: "", peelEnabled: false, botEnabled: true, level: 1, users: dummyUsers, bunch: []},
];
// for testing
initRoomBunch(initialRooms[5]);

// setting default : peelEnabled, botEnabled
// room later needs to read their CURRENT values at creation
export default function App() {
  const [peelEnabled, setPeelEnabled] = useState(true);
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
            ? { peelEnabled: false, botEnabled: false, level: 1, priv: false, key: "",creator: "", users: [], bunch: []} 
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
          peelEnabled: false, botEnabled: false, level: 1, priv: false, key: "",creator: "", users: [], bunch: []};
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
  // // **** for testing : SET ALL to READY ****
  //   function setUserReady(roomId: number, _sessionId: string, _ready: boolean) {
  //     setRooms((prev) =>
  //       prev.map((r) => {
  //         if (r.id !== roomId) return r;

  //         return {
  //           ...r,
  //           users: r.users.map((u) => ({ ...u, isReady: true })),
  //         };
  //       })
  //     );
  //   }

  function setUserReady(roomId: number, sessionId: string, ready: boolean) {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;

        return {
          ...r,
          users: r.users.map((u) =>
            u.id === sessionId ? { ...u, isReady: ready } : u
          ),
        };
      })
    );
  }

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
          };
          console.log("Peel!: ", u.name, " got: ", newTile.letter);
          return { ...u, tray: [...u.tray, newTile] };
        });

        return { ...r, users: updatedUsers, bunch };
      })
    );
  }

  return (
    <div className="background">
      <Leaderboard />
      <Settings
        peelEnabled={peelEnabled}
        onTogglePeel={() => setPeelEnabled(!peelEnabled)}
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
        peelEnabled={peelEnabled} 
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
        />
      )}
    </div>
  );
}
