import type { PlacedTile } from "../../types";

// peel check: check if all tiles are connected
export function checkAllTilesConnected (board: PlacedTile[]): boolean {
  if (board.length <= 1) return true;

  const tilePos = new Set(board.map((t) => `${t.x},${t.y}`));
  const checked = new Set<string>();
  const start = `${board[0].x},${board[0].y}`
  const next = [start];
  checked.add(start);
  const neighbours = [[0,-1],[0,1],[-1,0],[1,0]];
  
  while (next.length > 0) {
    const current = next.pop()!;
    const [cx, cy] = current.split(",").map(Number);

    for (const [dx, dy] of neighbours) {
      const neighbour:string = `${cx + dx},${cy + dy}`;
      if (tilePos.has(neighbour) && !checked.has(neighbour)) {
        checked.add(neighbour);
        next.push(neighbour);
      }
    }
  }
  return checked.size === board.length;
}

// -------- word fetch and spell check -----------

export interface WordEntry {
  word: string;
  tiles: { x: number; y: number }[];
}

export function fetchWords(board: PlacedTile[]): WordEntry[] {
  // map tiles of board to (key: x,y  value: letter)
  const tileAt: Map<string, string> = new Map();
  for (const t of board) {
    tileAt.set(`${t.x},${t.y}`, t.letter);
  }

  const entries: WordEntry[] = [];

  // horizontal fetch
  for (const t of board) {
    // skip tile if it's not word[0]
    if (tileAt.has(`${t.x - 1},${t.y}`)) continue;

    let word: string = "";
    const tiles: Array<{ x: number; y: number }> = [];
    let x = t.x;
    // found a word[0]
    while (tileAt.has(`${x},${t.y}`)) {
      word += tileAt.get(`${x},${t.y}`);
      tiles.push({ x, y: t.y });
      x++;
    }
    // only log words more than one letter
    if (word.length >= 2) entries.push({ word, tiles });
  }
  // vertical fetch
  for (const t of board) {
    if (tileAt.has(`${t.x},${t.y - 1}`)) continue;

    let word = "";
    const tiles: { x: number; y: number }[] = [];
    let y = t.y;
    while (tileAt.has(`${t.x},${y}`)) {
      word += tileAt.get(`${t.x},${y}`);
      tiles.push({ x: t.x, y });
      y++;
    }
    if (word.length >= 2) entries.push({ word, tiles });
  }

  return entries;
}

// *** do spell check ***
export function spellCheck(word: string): boolean {
  // *** replace with real dictionary lookup ***
  return true;
}

