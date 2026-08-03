import "./Tile.css";

interface TileProps {
  x: number;      // column, from 0
  y: number;      // row, from 0
  letter: string;

  id: string;

  valid?: boolean; // undefined = not part of any word yet

  draggable: boolean;
  onDragStart?: (e: React.DragEvent<HTMLElement>) => void;
}

// put tile in board
const CELL_SIZE = 40;
const OFFSET = 15; // border (15)
export default function Tile ({ x, y, letter, draggable, onDragStart, valid }: TileProps) {
  return (
    <div
      className="tile anim-tile-deal"
      style={{
        left: OFFSET + x * CELL_SIZE,
        top: OFFSET + y * CELL_SIZE,
        color: valid === undefined ? "#1d1d1b" : valid ? "#106a51" : "red",
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "none";
       }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {letter}
    </div>
  );
}