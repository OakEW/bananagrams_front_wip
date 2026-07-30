// import { useState } from "react";
import type { Room } from "../../types";
import Game from "./Game";
import "./GameRoom.css";

interface GameRoomProps {
  room: Room;
  sessionId: string;
  onBack: () => void;
  onQuit: () => void;
  onWin: () => void;
  onSetUserReady: (ready: boolean) => void;
  onPeel: () => void;
}

export default function GameRoom({
  room,
  sessionId,
  onBack,
  onQuit,
  onWin,
  onSetUserReady,
  onPeel,
}: GameRoomProps) {
  return (
  // BG
	<div style={{
    position: "absolute",
    inset: 0,
    zIndex: 200,
    background: "#043020",
    width: "1400px",
    height: "900px",
    overflow: "hidden",
  }}>

      {/* room header */}
      <h1 className="roomHeader" style={{left: 151}} > 
        Room: {room.name} 
        {room.priv && 
          <span style={{ color: "#eddebd", fontWeight: "400", fontSize: 16 }}>
            {" | "}Key: {room.key}
          </span>
        }
      </h1>

    <Game 
      room={room}
      sessionId={sessionId}
      onSetUserReady={onSetUserReady}
      onWin={onWin}
      onPeel={onPeel}
      onBack={onBack}
      onQuit={onQuit}
    />

    {/* BG decor */}
      <img src="assets_home/leaf_r1.svg" 
            className="leaf_r1 "
            style={{position: "absolute", left: 1275, top: 632, width: "220px"}} />
      <img src="assets_home/leaf_r1.svg" 
            className="leaf_r2 "
            style={{position: "absolute", left: 1050, top: 700, width: "520px"}} />

	</div>
  );
}