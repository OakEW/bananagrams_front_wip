import type { Room } from "../../types";

interface RoomButtonProps {
  room: Room;
  onSelect: (roomId: number) => void;
}

export default function RoomButton({ room, onSelect }: RoomButtonProps) {
  const isSolo = room.id === 1;
  const allNowReady = room.users.length > 0 && room.users.every((u) => u.isReady);

  let label = "";
  let style: React.CSSProperties = {};
  if (!isSolo) {
    if (allNowReady) {
      label = "···";
      style = { background: "#353535", color: "#757575" };
    } else if (room.users.length === 6) {
      label = "f";
    } else if (room.users.length === 0) {
      label = "+";
    } else {
      label = String(room.users.length);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        className={isSolo ? "room_solo" : "room_muti"}
        style={style}
        onClick={() => onSelect(room.id)}
      >
        {label}
      </button>
      <div
        className="room_text"
        style={{
          color: room.users.length > 0 ? "#ffbb12" : "#eddebd",
          fontFamily: "'typewriter', sans-serif",
          fontWeight: 900,
          textAlign: "center",
          whiteSpace: "nowrap",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 80,
        }}
      >
        {room.name}
      </div>
      {room.priv && (
        <img src="assets_home/private.svg" className="room_lock" />
      )}
      {room.peelEnabled && (
        <img src="assets_home/peel1.svg" className="room_peel" />
      )}
      {room.botEnabled && (
        <img src={`assets_home/lv${room.level}_r.svg`} className="room_lv" />
      )}
    </div>
  );
}
