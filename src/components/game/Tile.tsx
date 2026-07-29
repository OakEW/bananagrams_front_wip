import "./Tile.css";

interface TileProps {
  x: number;      // column, from 0
  y: number;      // row, from 0
  letter: string;
}

// put tile in board
const CELL_SIZE = 40;
const OFFSET = 16; // border (15) + centering (1) + 16
export default function Tile ({ x, y, letter }: TileProps) {
  return (
    <div
      className="tile anim-tile-deal"
      style={{
        left: OFFSET + x * CELL_SIZE,
        top: OFFSET + y * CELL_SIZE,
      }}
    >
      {letter}
    </div>
  );
}