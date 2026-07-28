import { useState } from "react";
import type { Room } from "../../types";

interface RoomKeyBoxProps {
  selectedRoom: Room | null;
  onJoin: (room: Room, key: string) => void;
}

export default function RoomKeyBox({ 
  selectedRoom, 
  onJoin, 
}: RoomKeyBoxProps) {

  const [roomKey, setRoomKey] = useState("");

  if (!selectedRoom) return null; // display: none

  const isSolo = selectedRoom.id === 1;
  const showKeyInput = !isSolo && selectedRoom.active === false;
  const cantJoin = selectedRoom.users.length === 6 && !selectedRoom.active;

  let enterLabel = "Let's go";
  let enterStyle: React.CSSProperties = {
    background: "#ffbb12",
    color: "#1d1d1b",
    cursor: "pointer",
    fontWeight: 900,
  };
  if (selectedRoom.active) {
    enterLabel = "Resume";
  } else if (cantJoin) {
    enterLabel = "Can't join";
    enterStyle = { background: "#545454", color: "#757575", cursor: "not-allowed", fontWeight: 400 };
  }

  function handleEnter() {
    if (cantJoin) return;
    onJoin(selectedRoom!, roomKey);
    setRoomKey("");
  }

  return (
    <div
      key={selectedRoom.id}
      className="anim-poppop"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "absolute",
        left: (selectedRoom.id - 1) * 100 + 40,
        top: !isSolo && !selectedRoom.active ? 710 : 742,
        zIndex: 50,
      }}
    >
      {showKeyInput && (
        <input
          className="room_key"
          type="text"
          placeholder="room key"
          value={roomKey}
          onChange={(e) => setRoomKey(e.target.value)}
          disabled={cantJoin}
        />
      )}
      <button
        className="room_enter"
        style={enterStyle}
        disabled={cantJoin}
        onClick={handleEnter}
      >
        {enterLabel}
      </button>
    </div>
  );
}
