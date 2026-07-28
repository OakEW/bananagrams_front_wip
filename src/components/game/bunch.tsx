import type { Room } from "../../types";

// Letter distribution (roughly Scrabble/Bananagrams-like)
const LETTER_BAG = [
  ..."AAAAAAAAAAAAA",
  ..."BBBB",
  ..."CCCC",
  ..."DDDDDD",
  ..."EEEEEEEEEEEEEEEEEE",
  ..."FFF",
  ..."GGGG",
  ..."HHH",
  ..."IIIIIIIIIIII",
  ..."JJ",
  ..."KK",
  ..."LLLLL",
  ..."MMMM",
  ..."NNNNNNNN",
  ..."OOOOOOOOOO",
  ..."PPP",
  ..."QQ",
  ..."RRRRRRRR",
  ..."SSSSSS",
  ..."TTTTTTTT",
  ..."UUUUUU",
  ..."VVV",
  ..."WWWW",
  ..."XX",
  ..."YYYY",
  ..."ZZ",
];

function shuffle(array: string[]): string[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function initRoomBunch(room: Room, count = 144) {
  room.bunch = shuffle(LETTER_BAG).slice(0, count);
  console.log("bunch:", room.bunch);
}