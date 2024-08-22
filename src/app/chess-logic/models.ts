import { Piece } from './pieces/pieces';

export enum Color {
  White,
  Black,
}

export type Coords = {
  x: number;
  y: number;
};

export enum FENChar {
  WhitePawn = 'P',
  WhiteBishop = 'B',
  WhiteRook = 'R',
  WhiteKnight = 'N',
  WhiteQueen = 'Q',
  WhiteKing = 'K',
  BlackPawn = 'p',
  BlackBishop = 'b',
  BlackRook = 'r',
  BlackKnight = 'n',
  BlackQueen = 'q',
  BlackKing = 'k',
}

export const pieceImagePaths: Readonly<Record<FENChar, string>> = {
  [FENChar.WhitePawn]: 'assets/pieces/white pawn.svg',
  [FENChar.WhiteKnight]: 'assets/pieces/white knight.svg',
  [FENChar.WhiteBishop]: 'assets/pieces/white bishop.svg',
  [FENChar.WhiteRook]: 'assets/pieces/white rook.svg',
  [FENChar.WhiteQueen]: 'assets/pieces/white queen.svg',
  [FENChar.WhiteKing]: 'assets/pieces/white king.svg',
  [FENChar.BlackPawn]: 'assets/pieces/black pawn.svg',
  [FENChar.BlackKnight]: 'assets/pieces/black knight.svg',
  [FENChar.BlackBishop]: 'assets/pieces/black bishop.svg',
  [FENChar.BlackRook]: 'assets/pieces/black rook.svg',
  [FENChar.BlackQueen]: 'assets/pieces/black queen.svg',
  [FENChar.BlackKing]: 'assets/pieces/black king.svg',
};

export type SafeSquares = Map<string, Coords[]>;

export type LastMove = {
  piece: Piece;
  prevX: number;
  prevY: number;
  currX: number;
  currY: number;
};

type KingChecked = {
  isInCheck: true;
  x: number;
  y: number;
};

type KingNotChecked = {
  isInCheck: false;
};

export type CheckState = KingChecked | KingNotChecked;

export const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
