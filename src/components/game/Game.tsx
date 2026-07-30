import { useEffect, useRef, useState } from "react";
import "./Game.css";
import Tile from "./Tile";
import type { Room } from "../../types";

// board matrix
// border size : 15px
// square size 40px
// tile size  38px
// board size 0-29 : 0-16 (30 * 17)

// tray matrix:
// tray size 0-21 : 0 (22 * 1)

// banna button pop | running in the background
interface GameProps {
  room: Room;
  sessionId:string;
  onSetUserReady: (ready: boolean) => void;
  onWin: () =>void;
  onPeel: () => void;
}

// animation restarter
function animationLoop(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const id = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      el.classList.remove("anim-pop");
      el.classList.remove("anim-click");
      void el.offsetWidth; // force reflow
      el.classList.add("anim-pop");
    }, 8000);

    return () => clearInterval(id);
  }, [ref]);
}
const animationClick = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  if (!el) return;
  el.classList.remove("anim-show");
  el.classList.remove("anim-click");
  void el.offsetWidth;
  el.classList.add("anim-click");
};

export default function Game({ 
    room,
    sessionId, 
    onSetUserReady, 
    onWin, 
    onPeel}: GameProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const currentUser = room.users.find((u) => u.id === sessionId);
  const allReady = room.users.length > 0 && room.users.every((u) => u.isReady);
  function onStartGame(e: React.MouseEvent<HTMLElement>) {
    animationClick(e);
    onSetUserReady(true);
  }

  const bananaRef = useRef<HTMLButtonElement>(null);
  animationLoop(bananaRef);

  function handlePeel(e: React.MouseEvent<HTMLElement>) {
    animationClick(e);
    onPeel();
  }

  function HandleBanana(e: React.MouseEvent<HTMLElement>) {
    animationClick(e);
    setShowConfirm(true);
  }

  // replace with a function to check if this user can call banana
  const bananaEnable = currentUser?.tray.length === 0
  const peelEnable = room.bunch.length >= room.users.length
  const dumpEnable = room.bunch.length >= 3
  return (
    <>
      {allReady 
      ? (
        <>
          <div className="board anim-show">
            {currentUser?.board.map((t, i) => (
              <Tile key={i} x={t.x} y={t.y} letter={t.letter} />
            ))}
          </div>
          <div className="tray anim-show">
            {currentUser?.tray.slice(0, 22).map((t, i) => (
              <Tile key={i} x={t.x} y={t.y} letter={t.letter} />
            ))}
            {currentUser && currentUser.tray.length > 22 && (
              <div 
                key={currentUser.tray.length}
                className="trayOverflow anim-pop" >
                +{currentUser.tray.length - 22} more
              </div>)}
          </div>
          {/* banana button or peel + dump button*/}
          {!peelEnable && !dumpEnable
            ? <button ref={bananaRef} className="bananabtn anim-pop"
                style={{
                  backgroundImage: bananaEnable
                    ? "url('assets_game/bananabttn.svg')"
                    : "url('assets_game/bananabttn0.svg')",
                  cursor: bananaEnable
                  ? "pointer" 
                  : "not-allowed",
                }} 
                onClick={bananaEnable ? HandleBanana : undefined } /> 
            : <>
                <button className="peelbtn anim-show" 
                  disabled={!peelEnable}
                  onClick={peelEnable ? handlePeel : undefined }
                  style={{ cursor: peelEnable ? "pointer" : "not-allowed"}}/>
                <button className="dumpbtn anim-show" 
                  disabled={!dumpEnable}
                  onClick={dumpEnable ? animationClick : undefined }
                  style={{ cursor: dumpEnable ? "pointer" : "not-allowed"}}/>
              </>
          }
          {showConfirm && 
            (<button className="confirmbtn anim-pop" onClick={onWin}></button>)}
        </>
      ) 
      : (
        <button className="startbtn anim-pop" 
        style={currentUser?.isReady
            ? { background: "#1d1d1b", color: "#eddebd", cursor: "wait" }
            : undefined
        }
        onClick={onStartGame}>
          {currentUser?.isReady ? "Waiting for others..." : "Start Game"}
        </button>
      )}

      {/* room header */}
      <h1 className="roomHeader" style={{left: 151}} > 
        Room: {room.name} 
        {room.priv && 
          <span style={{ color: "#eddebd", fontWeight: "400", fontSize: 16 }}>
            {" | "}Key: {room.key}
          </span>
        }
      </h1>

      {/* user area */}
      {room.users.map((user, index) => (
        <img
          key={user.id}
          src={user.isBot ? "assets_users/bot.png" : `assets_users/${user.name}.png`}
          alt={user.name}
          className="user"
          onClick={animationClick}
          style={{ top: 140 + index * 90 }}
          onError={(e) => { e.currentTarget.src = "assets_users/default.png"; }}
        />
      ))}
    </>
  );
}

