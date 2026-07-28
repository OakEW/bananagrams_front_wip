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

// tile for testing
const testBoardTiles: PlacedTile[] = [
  { x: 0, y: 0, letter: "t" },
  { x: 6, y: 3, letter: "e" },
  { x: 12, y: 6, letter: "s" },
  { x: 29, y: 16, letter: "t" },
];
const testTrayTiles: PlacedTile[] = [
  { x: 0, y: 0, letter: "t" },
  { x: 1, y: 0, letter: "e" },
  { x: 5, y: 0, letter: "s" },
  { x: 21, y: 0, letter: "t" },
];

interface GameProps {
  room: Room;
  sessionId:string;
}

export default function Game({ room, sessionId }: GameProps) {
  const currentUser = room.users.find((u) => u.id === sessionId);

  const boardTiles = currentUser?.board.length ? currentUser.board : testBoardTiles;
  const trayTiles = currentUser?.tray.length ? currentUser.tray : testTrayTiles;

  return (
    <>
    {/* board area */}
      <div className="board">
        {/* {currentUser?.board.map((t, i) => ( */}
        {boardTiles.map((t, i) => ( //for testing
          <Tile key={i} x={t.x} y={t.y} letter={t.letter} />
        ))}
      </div>

      {/* tray area */}
      <h1 className="roomHeader" style={{left: 151}} > Room: {room.name}</h1>
      <h1 className="roomHeader" style={{right: 340}} > @ {currentUser?.name}</h1>

      <div className="tray">
        {/* {currentUser?.tray.map((t, i) => ( */}
        {trayTiles.map((t, i) => ( //for testing
          <Tile key={i} x={t.x} y={t.y} letter={t.letter} />
        ))}
      </div>

      {/* banana button or peel button*/}
      {room.bunch.length === 0 
        ? <button className="bananabtn" /> 
        : <> <button className="peelbtn" />
          <button className="dumpbtn" /> </>}
      
      {/* dump tray */}


      {/* user area */}
      {room.users.map((user, index) => (
        <img
          key={user.id}
          src={user.isBot ? "assets_users/bot.png" : `assets_users/${user.name}.png`}
          alt={user.name}
          className="user"
          style={{ top: 140 + index * 90 }}
          onError={(e) => { e.currentTarget.src = "assets_users/default.png"; }}
        />
      ))}
    </>
  );
}

