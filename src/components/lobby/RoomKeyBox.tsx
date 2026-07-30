import { useState, useEffect } from "react";
import type { Room } from "../../types";

interface RoomKeyBoxProps {
  selectedRoom: Room | null;
  onJoin: (room: Room, key: string) => void;
  sessionId: string;
}

export default function RoomKeyBox({ 
  selectedRoom, 
  onJoin,
  sessionId,
}: RoomKeyBoxProps) {

  const [roomKey, setRoomKey] = useState("");

  useEffect(() => {
    setRoomKey("");
  }, [selectedRoom?.id]);

  if (!selectedRoom) return null; // display: none

  const isSolo = selectedRoom.id === 1;
  const isUserInRoom = selectedRoom.users.some((u) => u.id === sessionId);
  const showKeyInput = !isSolo && !isUserInRoom;
  const cantJoin = selectedRoom.users.length === 6 && !isUserInRoom;
  const allNowReady = selectedRoom.users.length > 0 && selectedRoom.users.every((u) => u.isReady);
  const isPublic = !selectedRoom.priv && selectedRoom.users.length > 0

  let enterLabel = "Let's go";
  let enterStyle: React.CSSProperties = {
    background: "#ffbb12",
    color: "#1d1d1b",
    cursor: "pointer",
    fontWeight: 900,
  };
  let place_holder = "Room key";
  let keyStyle: React.CSSProperties = {
    background: "#eddebd",
    color: "#1d1d1b",
    cursor: "text",
    fontWeight: 400,
  };

  if (isUserInRoom) {
    enterLabel = "Resume";
  } 
  if (allNowReady && !isUserInRoom) {
    place_holder = "a game is";
    enterLabel = "in session";
    enterStyle = { background: "#545454", color: "#757575", cursor: "not-allowed", fontWeight: 400 };
    keyStyle = { background: "#545454", color: "#757575", cursor: "not-allowed", fontWeight: 400 };
  }
  else if (cantJoin) {
    place_holder = "room is full";
    enterLabel = "can not join";
    enterStyle = { background: "#545454", color: "#757575", cursor: "not-allowed", fontWeight: 400 };
    keyStyle = { background: "#545454", color: "#757575", cursor: "not-allowed", fontWeight: 400 };
  }
  else if(isPublic) {
    place_holder = "public room";
    keyStyle = {background: "#043020", cursor: "default" };
  }


  function handleEnter() {
    if (cantJoin || (allNowReady && !isUserInRoom)) return;
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
        top: !isSolo && !isUserInRoom ? 710 : 742,
        zIndex: 50,
      }}
    >
      {showKeyInput && (
        <input
          className="room_key"
          type="text"
          placeholder = {place_holder}
          value={roomKey}
          style={keyStyle}
          onChange={(e) => setRoomKey(e.target.value)}
          disabled={cantJoin || (allNowReady && !isUserInRoom) || isPublic}
        />
      )}
      <button
        className="room_enter"
        style={enterStyle}
        disabled={cantJoin || (allNowReady && !isUserInRoom)}
        onClick={handleEnter}
      >
        {enterLabel}
      </button>
    </div>
  );
}
