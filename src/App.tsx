import { useState } from "react";
import "./App.css";
import Leaderboard from "./components/leaderboard/Leaderboard";
import Chat from "./components/chat/Chat";
import Settings from "./components/lobby/Settings";
import LoginForm from "./components/lobby/LoginForm";
import RoomList from "./components/lobby/RoomList";
import BgDecor from "./components/lobby/BgDecor";
import GameRoom from "./components/game/GameRoom";
// rooms
import type { Room } from "./types";
// tile type
import type { PlacedTile } from "./types";

// init rooms from this list
const initialRooms: Room[] = [
  { id: 1, priv: false, name: "Solo",        key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 2, priv: false, name: "Cavendish",   key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 3, priv: false, name: "Plantain",    key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 4, priv: false, name: "Goldfinger",  key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 5, priv: false, name: "Manzano",     key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 6, priv: false, name: "Gros_Michel", key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
];

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
            ? { peelEnabled: false, botEnabled: false, level: 1, priv: false, key: "", users: [], bunch: []} 
            : {}),
      };
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
  function setUserReady(roomId: number, sessionId: string, ready: boolean) {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;

        const updatedUsers = r.users.map((u) =>
          u.id === sessionId ? { ...u, isReady: ready } : u
        );

        const allNowReady = updatedUsers.length > 0 && updatedUsers.every((u) => u.isReady);
        const alreadyDealt = updatedUsers.some((u) => u.tray.length > 0);

        // deal tiles exactly once, the moment everyone is ready
        if (allNowReady && !alreadyDealt) {
          const bunch = [...r.bunch];
          const count = tilesPerPlayer(updatedUsers.length);

          const dealtUsers = updatedUsers.map((u) => {
            const drawn = bunch.splice(0, count); // take `count` letters off the top
            const tray: PlacedTile[] = drawn.map((letter, i) => ({
              x: i,
              y: 0,
              letter,
            }));
            return { ...u, tray };
          });

          return { ...r, users: dealtUsers, bunch };
        }

        return { ...r, users: updatedUsers };
      })
    );
  }
  // peel button
  function peelForAll(roomId: number) {
  setRooms((prev) =>
    prev.map((r) => {
      if (r.id !== roomId) return r;
      if (r.bunch.length === 0) return r; // nothing left to peel

      const bunch = [...r.bunch];

      const updatedUsers = r.users.map((u) => {
        const letter = bunch.shift(); // take the next letter off the top
        if (!letter) return u; // bunch ran out mid-loop, leave this user as-is

        const newTile: PlacedTile = {
          x: u.tray.length, // append to the end of their tray
          y: 0,
          letter,
        };
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
          onSetUserReady={(ready: boolean) => setUserReady(currentRoom.id, sessionId, ready)}
          onPeel={() => peelForAll(currentRoom.id)}
        />
      )}
    </div>
  );
}
