import { useState, useEffect } from "react";
import type { Room, User } from "../../types";
import RoomButton from "./RoomButton";
import RoomKeyBox from "./RoomKeyBox";
// bunch init
import { initRoomBunch } from "../game/bunch"

interface RoomListProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  initialRooms: Room[];
  peelEnabled: boolean;
  botEnabled: boolean;
  level: number;
  isLogin: boolean;
  userName: string;
  sessionId: string;
  onEnterRoom: (room: Room) => void;
}

export default function RoomList({ 
    rooms,
    setRooms,
    initialRooms,
    peelEnabled, 
    botEnabled, 
    level, 
    isLogin,
    userName,
    sessionId,
    onEnterRoom
}: RoomListProps) {

  useEffect(() => {
    setRooms(initialRooms);
    setSelectedRoomId(null);
  }, [isLogin]);

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;

  // Called when "Let's go" / "Resume" is clicked.
  function joinRoom(room: Room, key: string) {
  if (room.users.length === 6 && !room.active) return; // can't join a full room

  if (room.active) {
    // Resuming an already-active room
    console.log("resuming room:", room.id);
    onEnterRoom(room);
    return;
  }
  // Joining(create) fresh: bot adds 2 players instead of 1, 
  const wasEmpty = room.users.length === 0;
  const displayName = userName || `Guest_${sessionId.slice(0, 4)}`;
  // build the new user(s) joining
  const newUsers: User[] = [
    { id: sessionId, name: displayName, isBot: false, tray: [], board: [] },
  ];
  if (botEnabled && wasEmpty) {
    newUsers.push({ id: "0000", name: "Bot", isBot: true, tray: [], board: [] });
    }
  else
    console.log("join room:", room.id);

  const updatedRoom: Room = {
    ...room,
    priv: wasEmpty && key !== "" ? true : room.priv,
    active: true,
    users: [...room.users, ...newUsers],
    ...(wasEmpty ? { peelEnabled, botEnabled, level, key, creator: displayName } : {}),
  };
  if (wasEmpty) {
    console.log("create room:", updatedRoom.id);
    if (updatedRoom.priv)
      console.log("create room key:", updatedRoom.key);
    initRoomBunch(updatedRoom);
  }
  setRooms((prev) => prev.map((r) => (r.id === room.id ? updatedRoom : r)));
  onEnterRoom(updatedRoom); // pass the freshly build room
}

  return (
    <>
      <div
        key={isLogin ? "logged-in" : "logged-out"}
        className="rooms_container anim-poppop"
        style={{ position: "absolute", left: 50, top: 780, zIndex: 70, animationDelay: "1s" }}
      >
        {rooms.map((room, index) => (
          <div key={room.id} style={{ position: "absolute", left: index * 100 }}>
            <RoomButton room={room} onSelect={setSelectedRoomId} />
          </div>
        ))}
      </div>

      <RoomKeyBox 
        selectedRoom={selectedRoom} 
        onJoin={joinRoom} 
      />
    </>
  );
}
