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
  onDump: (tileId: string) => void;
  onPlacingBoard: (tileId: string, x: number, y: number) => void;
  onPlacingTray: (tileId: string) => void;
  onBack: () => void;
  onQuit: () => void;
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
    onPeel,
    onDump,
    onPlacingBoard,
    onPlacingTray,
    onBack,
    onQuit
  }: GameProps) {
  const currentUser = room.users.find((u) => u.id === sessionId);
  const allReady = room.users.length > 0 && room.users.every((u) => u.isReady);
  const [showWin, setshowWin] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  function onStartGame(e: React.MouseEvent<HTMLElement>) {
    animationClick(e);
    onSetUserReady(true);
  }

  function handlePeel(e: React.MouseEvent<HTMLElement>) {
    animationClick(e);
    onPeel();
  }

  function HandleBanana(e: React.MouseEvent<HTMLElement>) {
    animationClick(e);
    setshowWin(true);
  }

  function handleDump(
    e: React.DragEvent<HTMLElement>) {
    if (!dumpEnable) return;
    animationClick(e);
    const id = String(e.dataTransfer.getData("text/plain"));
    onDump(id);
  }

    function handlePlacingBoard(
    e: React.DragEvent<HTMLElement>) {
    // animationClick(e);
    const id = String(e.dataTransfer.getData("text/plain"));
    const board = e.currentTarget;
    const rect = board.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = Math.floor((mouseX - 15) / 40);
    const y = Math.floor((mouseY - 15) / 40);
    onPlacingBoard(id, x, y);
  }

    function handlePlacingTray(
    e: React.DragEvent<HTMLElement>) {
    // animationClick(e);
    const id = String(e.dataTransfer.getData("text/plain"));
    onPlacingTray(id);
  }

  // replace with a function to check if this user can call banana
  const bananaEnable = currentUser?.tray.length === 0
  const peelEnable = room.bunch.length >= room.users.length
  const dumpEnable = room.bunch.length >= 3

    // animation restarter
  function animationLoop(ref: React.RefObject<HTMLElement | null>, showWin: boolean, bananaEnable:boolean) {
    useEffect(() => {
      if (showWin || !bananaEnable) return;
      const id = setInterval(() => {
        const el = ref.current;
        if (!el) return;
        el.classList.remove("anim-pop");
        el.classList.remove("anim-click");
        void el.offsetWidth; // force reflow
        el.classList.add("anim-pop");
      }, 4000);

      return () => clearInterval(id);
    }, [ref, showWin, bananaEnable]);
  }
  const bananaRef = useRef<HTMLButtonElement>(null);
  animationLoop(bananaRef, showWin, bananaEnable);



  return (
    <>
      {allReady 
      ? (
        <>
          {/* board area */}
          <div 
            className="board anim-show"
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={handlePlacingBoard}
          >
            {currentUser?.board.map((t, i) => (
              <Tile key={t.id} x={t.x} y={t.y} letter={t.letter} id={t.id}
                draggable={!showQuitConfirm && !showWin}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", String(t.id));
                  e.dataTransfer.effectAllowed = "move";
              }} />
            ))}
          </div>
          {/* tray area */}
          <div className="tray anim-show"
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={handlePlacingTray}
          >
            {currentUser?.tray.slice(0, 22).map((t, i) => (
              <Tile key={t.id} x={i} y={0} letter={t.letter} id={t.id}
                draggable={!showQuitConfirm && !showWin}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", String(t.id));
                  e.dataTransfer.effectAllowed = "move";
              }} />
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
            ? <button ref={bananaRef} className="bananabtn"
                style={{
                  backgroundImage: bananaEnable
                    ? "url('assets_game/bananabttn.svg')"
                    : "url('assets_game/bananabttn0.svg')",
                  cursor: showWin
                  ? "default"
                  : bananaEnable
                    ? "pointer"
                    : "not-allowed",
                }} 
                disabled={showWin}
                onClick={bananaEnable ? HandleBanana : undefined } /> 
            : <>
                {/* peel button */}
                <button className="peelbtn anim-show" 
                  disabled={!peelEnable}
                  onClick={peelEnable && !showQuitConfirm ? handlePeel : undefined }
                  style={{ 
                    cursor: showQuitConfirm ?  "default" :
                      peelEnable ? "pointer" : "not-allowed",
                    backgroundImage: peelEnable
                    ? "url('assets_game/peelbttn.svg')"
                    : "url('assets_game/peelbttn0.svg')"
                  }}/>

                {/* dump erea */}
                <button className="dumpbtn anim-show" 
                  disabled={!dumpEnable}
                  onDragOver={(e) => { if (dumpEnable) e.preventDefault(); }}
                  onDrop={dumpEnable ? handleDump : undefined}
                  style={{ 
                    cursor: showQuitConfirm ?  "default" :
                      dumpEnable ? "copy" : "not-allowed",
                    backgroundImage: dumpEnable
                    ? "url('assets_game/dumpbttn.svg')"
                    : "url('assets_game/dumpbttn0.svg')"
                  }}/>
              </>
          }
          {showWin && 
            (<>
              <button className="winbtn anim-show-pop" onClick={onWin}></button>
              <div className="winbtn_text anim-wobble" style={{animationDelay : "0.65s"}} onClick={onWin}></div>
              <div className="winbtn_left anim-wobble" style={{animationDelay : "0.4s"}} onClick={onWin}></div>
              <div className="winbtn_right anim-wobble" style={{animationDelay : "0.5s"}} onClick={onWin}></div>
            </>
            )}
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

    {/* back button */}
    <img
      src="assets_game/back.svg"
      className="back anim-show"
      onClick={!showWin && !showQuitConfirm ? onBack : undefined}
      style={showWin || showQuitConfirm ? {cursor: "default"} : undefined }
    />
    {/* quit button */}
    <img
      src="assets_game/quit.svg"
      className="close anim-show"
      onClick={!showWin && !showQuitConfirm ? () => setShowQuitConfirm(true) : undefined}
      style={{
        animationDelay: "0.2s",
        cursor: showWin || showQuitConfirm ? "default" : "pointer",
      }}
    />
    {showQuitConfirm && (
      <div className="quitConfirmBox anim-show">
        <p>You won't be able to rejoin once the game is in session</p>
        <button className="quitYes" onClick={onQuit}>Quit</button>
        <button className="quitNo" onClick={() => setShowQuitConfirm(false)}>Stay</button>
      </div>
    )}

      {/* user area */}
      {room.users.map((user, index) => (
        <img
          key={user.id}
          src={user.isBot ? "assets_users/bot.png" : `assets_users/${user.name}.png`}
          alt={user.name}
          className="user anim-show"
          onClick={!showQuitConfirm ? animationClick : undefined}
          style={{ top: 140 + index * 90,
                    cursor: showQuitConfirm ? "default" : "pointer",
          }}
          onError={(e) => { e.currentTarget.src = "assets_users/default.png"; }}
        />
      ))}
    </>
  );
}

