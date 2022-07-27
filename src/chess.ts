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
  activeColour: 'White' | 'Black'
}

export interface Piece {
  occupierKey: SquareOccupier;
  name: string;
  offset: number;
  captured: boolean;
  img: string;
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

export function createGameFromFen(fen: string) {
  // starting pos fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  // 1. piece placement data
  // 2. active colour
  // 3. castling option. '-' if neither side can castle, 'KQkq' if both sides can castle both sides
  // 4. en passant target square. '-' if none exists
  // 5. half move clock: the number of half moves since the last capture or pawn advance
  // 6. fullmove number: the number of full moves
  const game: Game = {
    board: createBoard(),
    lastMoveWasDoublePawnMove: false,
    activeColour: 'White'
  }
  const fenSplit = fen.split(' ');
  const piecePlacement = fenSplit[0];
  const activeColour = fenSplit[1];
  const castlingOption = fenSplit[2];
  const enPassantTarget = fenSplit[3];
  const halfMoveClock = fenSplit[4];
  const fullmoveNumber = fenSplit[5];
  return game;
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

  const offsets: number[] = [];
  const index = board.squares.findIndex(sq => sq.offset === currentOffset);
  if (index === -1) {
    return offsets;
  }
  // from bottom left
  const indexMoves = [
    23, 10, -14, -25, -23, -10, 14, 25
  ];
  indexMoves.forEach(i => {
    const sq = board.squares[index + i];
    if (sq.offset !== 0 && sq.occupier === SquareOccupier.Empty) {
      offsets.push(sq.offset);
    }
  });
  return offsets;
}

export function getQueenMoves(currentOffset: number, board: Board) {
  return [...getRookMoves(currentOffset, board), ...getBishopMoves(currentOffset, board)]
}

export function getRookMoves(currentOffset: number, board: Board) {
  // todo: 
  // if square has a piece on it and is same colour stop going in that direction
  // if square has enemy piece on it, it's a capture
  const index = board.squares.findIndex(sq => sq.offset === currentOffset);
  if (index === -1) {
    return [];
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
  };

  return [...getOffsets(-12), ...getOffsets(1), ...getOffsets(12), ...getOffsets(-1)];
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