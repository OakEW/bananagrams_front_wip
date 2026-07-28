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

// init rooms from this list
const initialRooms: Room[] = [
  { id: 1, priv: false, active: false, name: "Solo",        key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1, users: [], bunch: []},
  { id: 2, priv: false, active: false, name: "Cavendish",   key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1 , users: [], bunch: []},
  { id: 3, priv: false, active: false, name: "Plantain",    key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1 , users: [], bunch: []},
  { id: 4, priv: false, active: false, name: "Goldfinger",  key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1 , users: [], bunch: []},
  { id: 5, priv: false, active: false, name: "Manzano",     key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1 , users: [], bunch: []},
  { id: 6, priv: false, active: false, name: "Gros_Michel", key: "", creator: "", peelEnabled: false, botEnabled: false, level: 1 , users: [], bunch: [12]},
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
        active: false,
        users: newUsers,
        ...(isNowEmpty || isBotOnly 
            ? { peelEnabled: false, botEnabled: false, level: 1, priv: false, key: "", pc : 0, users: []} 
            : {}),
      };
    })
  );
  setCurrentRoomId(null);
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
          onBack={() => setCurrentRoomId(null)}
          onQuit={() => quitRoom(currentRoom.id)}
        />
      )}
    </div>
  );
}
