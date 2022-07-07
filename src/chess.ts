export enum SquareOccupier {
  Empty = 0,
  WhitePawn = 1,
  BlackPawn = -1,
  WhiteKnight = 2,
  BlackKnight = -2,
  WhiteBishop = 3,
  BlackBishop = -3,
  PristineWhiteRook = 4,
  PristineBlackRook = -4,
  DirtyWhiteRook = 5,
  DirtyBlackRook = -5,
  WhiteQueen = 6,
  BlackQueen = -6,
  PristineWhiteKing = 7,
  PristineBlackKing = -7,
  DirtyWhiteKing = 8,
  DirtyBlackKing = -8
};
interface Square {
  occupier: SquareOccupier;
  offset: number;
  // coord: string;
}

export interface Board {
  squares: Square[]
}

export interface Game {
  board: Board;
  lastMoveWasDoublePawnMove: boolean;
}

export interface Piece {
  occupierKey: SquareOccupier;
  name: string;
  offset: number;
  captured: boolean;
}

export function createBoard() {
  const board: Board = {
    squares: []
  };
  const verticalSquares = 12;
  for (let index = 0; index < verticalSquares; index++) {
    if (index < 2 || index >= 10) {
      board.squares.push(...new Array(12).fill({ occupier: SquareOccupier.Empty, offset: 0 }));
    } else {
      const leftOffset = 20 - index;
      board.squares.push(...[
        0, 0, leftOffset, leftOffset + 10, leftOffset + 20, leftOffset + 30, leftOffset + 40, leftOffset + 50, leftOffset + 60, leftOffset + 70, 0, 0
      ].map(offset => ({ occupier: SquareOccupier.Empty, offset })))
    }

  }
  return board;
}


export function printBoardOffsets(board: Board) {
  let result = '';
  for (let index = 0; index < 12; index++) {
    result += `${board.squares.map(x => x.offset).slice(index * 12, (index * 12) + 12).join('\t')}`
    if (index !== 11) {
      result += '\n';
    }
  }
  return result;
}


// todo: 