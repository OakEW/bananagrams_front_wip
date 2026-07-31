import type { Room } from "../../types";

// Letter distribution
// English
// A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z
// 13 3  3  6  18 3  4  3  12 2  2  5  3  8  11 3  2  9  6  9  6  3  3  2  3  2
// French
// A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z
// 13 3  4  6  18 3  2  2  12 2  1  6  4  9  12 4  2  10 6  10 6  4  1  2  1  1
// Spanish
// A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z  Ñ LL RR CH
// 17 3  5  7  17 2  3  3  8  2  1  5  3  7  12 3  2  7  8  6  7  2  1  1  2  2  2  2  2  2
// "LL", "LL",  //2     NO spread operator ... 

const LETTER_BAG_EN = [
  ..."AAAAAAAAAAAAA", //13
  ..."BBB",           //3
  ..."CCC",           //3
  ..."DDDDDD",        //6
  ..."EEEEEEEEEEEEEEEEEE", //18
  ..."FFF",           //3
  ..."GGGG",          //4
  ..."HHH",           //3
  ..."IIIIIIIIIIII",  //12
  ..."JJ",            //2
  ..."KK",            //2
  ..."LLLLL",         //5
  ..."MMM",           //3
  ..."NNNNNNNN",      //8
  ..."OOOOOOOOOOO",   //11
  ..."PPP",           //3
  ..."QQ",            //2
  ..."RRRRRRRRR",     //9
  ..."SSSSSS",        //6
  ..."TTTTTTTTT",     //9
  ..."UUUUUU",        //6
  ..."VVV",           //3
  ..."WWW",           //3
  ..."XX",            //2
  ..."YYY",           //3
  ..."ZZ",            //2
];

export function shuffle(array: string[]): string[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function initRoomBunch(room: Room) {
  room.bunch = shuffle(LETTER_BAG_EN);
  console.log("bunch:", room.bunch);
}