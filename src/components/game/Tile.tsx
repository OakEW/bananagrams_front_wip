import "./Tile.css";

interface TileProps {
  x: number;      // column, from 0
  y: number;      // row, from 0
  letter: string;

  id: string;

  draggable: boolean;
  onDragStart?: (e: React.DragEvent<HTMLElement>) => void;
}

// put tile in board
const CELL_SIZE = 40;
const OFFSET = 15; // border (15)
export default function Tile ({ x, y, letter, draggable, onDragStart }: TileProps) {
  return (
    <div
      className="tile anim-tile-deal"
      style={{
        left: OFFSET + x * CELL_SIZE,
        top: OFFSET + y * CELL_SIZE,
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "none";
              }}
    >
      {letter}
    </div>
  );
}