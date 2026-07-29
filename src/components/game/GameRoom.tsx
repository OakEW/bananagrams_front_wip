import type { Room } from "../../types";
import Game from "./Game";
import "./GameRoom.css";

interface GameRoomProps {
  room: Room;
  sessionId: string;
  onBack: () => void;
  onQuit: () => void;
  onSetUserReady: (ready: boolean) => void;
  onPeel: () => void;
}

export default function GameRoom({
  room,
  sessionId,
  onBack,
  onQuit,
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

    {/* back button */}
    <img
      src="assets_game/back.svg"
      className="back"
      onClick={onBack}
    />
    {/* quit button */}
    <img
      src="assets_game/quit.svg"
      className="close"
      onClick={onQuit}
    />

    {/* board */}
    <Game 
      room={room}
      sessionId={sessionId}
      onSetUserReady={onSetUserReady}
      onPeel={onPeel}
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