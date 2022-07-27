import blackBishop from '../assets/bB.png';
import blackKing from '../assets/bK.png';
import blackKnight from '../assets/bN.png';
import blackPawn from '../assets/bP.png';
import blackQueen from '../assets/bQ.png';
import blackRook from '../assets/bR.png';
import whiteBishop from '../assets/wB.png';
import whiteKing from '../assets/wK.png';
import whiteKnight from '../assets/wN.png';
import whitePawn from '../assets/wP.png';
import whiteQueen from '../assets/wQ.png';
import whiteRook from '../assets/wR.png';

export const InitialPieceData = {
  WhiteKing: {
    img: whiteKing,
  }
};



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

const createGame = (board: Board) => {

};

export function getCoordFromOffset(offset: number): string {
  if (offset < 11 || offset > 88) {
    return '';
  }
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
  let file = files[Math.floor(offset / 10) - 1];
  let rank = ranks[offset % 10 - 1];
  if (!rank) {
    return '';
  }
  return `${file}${rank}`;
}


export function getOffsetFromCoord(coord: string): number {
  const sanitisedCoord = coord.trim().toLowerCase();
  if (sanitisedCoord.length !== 2) {
    return 0;
  }
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const fileIndex = files.findIndex(x => x === sanitisedCoord[0]);
  if (fileIndex === -1) {
    return 0;
  }
  const fileOffset = fileIndex + 1;
  const rankNumber = Number(sanitisedCoord[1]);
  if (rankNumber < 1 || rankNumber > 8) {
    return 0;
  }
  return Number(`${fileOffset}${rankNumber}`);


}

export function getKingMoves(currentOffset: number, board: Board) {
  const offsets: number[] = [];
  if (currentOffset === 0) {
    return [];
  }
  const pseudoLegalMoveDirectionIndexes = [-13, -12, -11, -1, 1, 11, 12, 13];
  const index = board.squares.findIndex(sq => sq.offset === currentOffset);
  if (index === -1) {
    return offsets;
  }
  pseudoLegalMoveDirectionIndexes.forEach(i => {
    const square = board.squares[index + i];
    if (square.occupier === SquareOccupier.Empty && square.offset !== 0) {
      offsets.push(square.offset);
    }
  });

  return offsets;
}

export function getBishopMoves(currentOffset: number, board: Board) {
  const offsets: number[] = [];
  const topLeftInc = -13;
  const topRightInc = -11;
  const bottomLeftInc = 11
  const bottomRightInc = 13;
  const index = board.squares.findIndex(sq => sq.offset === currentOffset);
  if (index === -1) {
    return offsets;
  }
  const getOffsets = (inc: number) => {
    const result: number[] = [];
    let currentIndex = index;
    while (true) {
      currentIndex += inc;
      const squareOffset = board.squares[currentIndex].offset;
      if (squareOffset == 0) {
        break;
      }
      result.push(squareOffset);
    }
    return result;
  }
  return [...getOffsets(topLeftInc), ...getOffsets(topRightInc), ...getOffsets(bottomLeftInc), ...getOffsets(bottomRightInc)]
}

export function getKnightMoves(currentOffset: number, board: Board) {
  const min = 11;
  const max = 88;

  const offsets = [
    currentOffset - 21,
    currentOffset - 19,
    currentOffset - 8,
    currentOffset + 12,
    currentOffset + 21,
    currentOffset + 19,
    currentOffset + 8,
    currentOffset - 12
  ];

  return offsets.filter(x => x >= min && x <= max && x % 10 !== 0 && x % 10 !== 9);
}

export function getQueenMoves(currentOffset: number) {
  return [...getRookMoves(currentOffset), ...getBishopMoves(currentOffset)]
}

export function getRookMoves(currentOffset: number) {
  const offsets = [];
  const min = 11;
  const max = 88;
  const minBottom = (10 * Math.floor(currentOffset / 10)) + 1;
  const maxTop = minBottom + 7;
  console.log(maxTop);
  let current = currentOffset;

  // left
  while (current >= min) {
    current -= 10;
    if (current >= min) {
      offsets.push(current);
    }
  }
  // top
  current = currentOffset;
  while (current <= maxTop) {
    current += 1;
    if (current <= maxTop) {
      if (current <= maxTop) {
        offsets.push(current);
      }
    }
  }
  // right
  current = currentOffset;
  while (current <= max) {
    current += 10;
    if (current <= max) {
      offsets.push(current);
    }
  }
  // down
  current = currentOffset;
  while (current >= minBottom) {
    current -= 1;
    if (current >= minBottom) {
      offsets.push(current);
    }
  }
  return offsets;

}

export function placePieceOnSquare(occupier: SquareOccupier, coord: string, board: Board) {
  const offset = getOffsetFromCoord(coord);
  if (offset !== 0) {
    const sq = board.squares.find(x => x.offset === offset);
    if (sq) {
      sq.occupier = occupier;
    }
  }
}