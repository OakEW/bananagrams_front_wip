import { useEffect, useRef } from "react";
import "./Game.css";
import Tile from "./Tile";
import type { Room, PlacedTile } from "../../types";

// board matrix
// border size : 15px
// square size 40px
// tile size  38px
// board size 0-29 : 0-16 (30 * 17)

// tray matrix:
// tray size 0-21 : 0 (22 * 1)

// banna button pop | running in the background
function animationLoop(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const id = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      el.classList.remove("anim-pop");
      void el.offsetWidth; // force reflow
      el.classList.add("anim-pop");
    }, 8000);

    return () => clearInterval(id);
  }, [ref]);
}
// el click animation
const animationClick = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  if (!el) return;
  el.classList.remove("anim-click");
  void el.offsetWidth;
  el.classList.add("anim-click");
};


interface GameProps {
  room: Room;
  sessionId:string;
}

export default function Game({ room, sessionId }: GameProps) {
  const currentUser = room.users.find((u) => u.id === sessionId);
  // testing tiles 
  // tile need to be added in react method
// also need a function to init room.bunch
// tile for testing
  const testBoardTiles: PlacedTile[] = [
    { x: 0, y: 0, letter: room.bunch[0] },
    { x: 1, y: 1, letter: room.bunch[1] },
    { x: 12, y: 6, letter: room.bunch[2] },
    { x: 29, y: 16, letter: room.bunch[3] },
  ];
  const testTrayTiles: PlacedTile[] = [
    { x: 0, y: 0, letter: room.bunch[4] },
    { x: 1, y: 0, letter: room.bunch[5] },
    { x: 5, y: 0, letter: room.bunch[6] },
    { x: 21, y: 0, letter: room.bunch[7] },
  ];
  if (currentUser) {
    if (currentUser.board.length === 0) {
      currentUser.board.push(...testBoardTiles);
    }
    if (currentUser.tray.length === 0) {
      currentUser.tray.push(...testTrayTiles);
    }
  }
  const bananaRef = useRef<HTMLButtonElement>(null);
  animationLoop(bananaRef);

  return (
    <>
    {/* board area */}
      <div className="board">
        {currentUser?.board.map((t, i) => (
          <Tile key={i} x={t.x} y={t.y} letter={t.letter} />
        ))}
      </div>

      {/* tray area */}
      <h1 className="roomHeader" style={{left: 151}} > 
        Room: {room.name} 
        {room.priv && 
          <span style={{ color: "#eddebd", fontWeight: "400", fontSize: 16 }}>
            {" | "}Key: {room.key}
          </span>
        }
      </h1>
      <h1 className="roomHeader" style={{right: 340}} > @ {currentUser?.name}</h1>

      <div className="tray">
        {currentUser?.tray.map((t, i) => (
          <Tile key={i} x={t.x} y={t.y} letter={t.letter} />
        ))}
      </div>

      {/* banana button or peel + dump button*/}
      {room.bunch.length === 0 
        ? <button ref={bananaRef} className="bananabtn anim-pop" /> 
        : <> 
            <button className="peelbtn" onClick={animationClick}/>
            <button className="dumpbtn" onClick={animationClick} /> 
          </>}

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

