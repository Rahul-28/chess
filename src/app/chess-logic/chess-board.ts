import {
  CheckState,
  Color,
  Coords,
  FENChar,
  LastMove,
  SafeSquares,
} from './models';
import { Bishop } from './pieces/bishop';
import { King } from './pieces/king';
import { Knight } from './pieces/knight';
import { Pawn } from './pieces/pawn';
import { Piece } from './pieces/pieces';
import { Queen } from './pieces/queen';
import { Rook } from './pieces/rook';

export class chessBoard {
  private chessBoard: (Piece | null)[][];
  private readonly chessBoardSize: number = 8;
  private _playerColor = Color.White;
  private _safeSquares: SafeSquares;
  private _lastMove: LastMove | undefined;
  private _checkState: CheckState = { isInCheck: false };

  constructor() {
    this.chessBoard = [
      [
        new Rook(Color.White),
        new Knight(Color.White),
        new Bishop(Color.White),
        new Queen(Color.White),
        new King(Color.White),
        new Bishop(Color.White),
        new Knight(Color.White),
        new Rook(Color.White),
      ],
      [
        new Pawn(Color.White),
        new Pawn(Color.White),
        new Pawn(Color.White),
        new Pawn(Color.White),
        new Pawn(Color.White),
        new Pawn(Color.White),
        new Pawn(Color.White),
        new Pawn(Color.White),
      ],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
        new Pawn(Color.Black),
      ],
      [
        new Rook(Color.Black),
        new Knight(Color.Black),
        new Bishop(Color.Black),
        new Queen(Color.Black),
        new King(Color.Black),
        new Bishop(Color.Black),
        new Knight(Color.Black),
        new Rook(Color.Black),
      ],
    ];
    this._safeSquares = this.findSafeSquares();
  }

  public get playerColor(): Color {
    return this._playerColor;
  }

  public get chessBoardView(): (FENChar | null)[][] {
    return this.chessBoard.map(eachRow => {
      return eachRow.map(piece =>
        piece instanceof Piece ? piece.FENChar : null
      );
    });
  }

  public get safeSquares(): SafeSquares {
    return this._safeSquares;
  }

  public get lastMove(): LastMove | undefined {
    return this._lastMove;
  }

  public get checkState(): CheckState {
    return this._checkState;
  }

  public static isSquareBlack(coordinates: Coords): boolean {
    return (
      (coordinates.x % 2 === 0 && coordinates.y % 2 == 0) ||
      (coordinates.x % 2 === 1 && coordinates.y % 2 == 1)
    );
  }

  private areCoordsValid(x: number, y: number): boolean {
    return (
      x >= 0 && y >= 0 && x < this.chessBoardSize && y < this.chessBoardSize
    );
  }

  public isInCheck(
    playerColor: Color,
    checkingCurrentPosition: boolean
  ): boolean {
    for (let i = 0; i < this.chessBoardSize; i++) {
      for (let j = 0; j < this.chessBoardSize; j++) {
        const piece: Piece | null = this.chessBoard[i][j];

        if (!piece || piece.color === playerColor) {
          continue;
        }
        for (const { x: dx, y: dy } of piece.directions) {
          let newX: number = i + dx;
          let newY: number = j + dy;

          if (!this.areCoordsValid(newX, newY)) {
            continue;
          }

          if (
            piece instanceof Pawn ||
            piece instanceof Knight ||
            piece instanceof King
          ) {
            // pawns can attack diagonally only
            if (piece instanceof Pawn && dy === 0) {
              continue;
            }

            const attackedPiece: Piece | null = this.chessBoard[newX][newY];
            if (
              attackedPiece instanceof King &&
              attackedPiece.color === playerColor
            ) {
              if (checkingCurrentPosition) {
                this._checkState = { isInCheck: true, x: newX, y: newY };
              }
              return true;
            }
          } else {
            while (this.areCoordsValid(newX, newY)) {
              const attackedPiece: Piece | null = this.chessBoard[newX][newY];
              if (
                attackedPiece instanceof King &&
                attackedPiece.color === playerColor
              ) {
                if (checkingCurrentPosition) {
                  this._checkState = { isInCheck: true, x: newX, y: newY };
                }
                return true;
              }

              if (attackedPiece !== null) {
                break;
              }

              newX += dx;
              newY += dy;
            }
          }
        }
      }
    }
    if (checkingCurrentPosition) {
      this._checkState = { isInCheck: false };
    }
    return false;
  }

  private isPositionSafeAfterMove(
    piece: Piece,
    prevX: number,
    prevY: number,
    newX: number,
    newY: number
  ): boolean {
    const newPiece: Piece | null = this.chessBoard[newX][newY];

    // cannot attack a piece of same color
    if (newPiece && newPiece.color === piece.color) {
      return false;
    }

    // simulate postion
    this.chessBoard[prevX][prevY] = null;
    this.chessBoard[newX][newY] = piece;

    const isPositionSafe: boolean = !this.isInCheck(piece.color, false);

    //restore postion
    this.chessBoard[prevX][prevY] = piece;
    this.chessBoard[newX][newY] = newPiece;

    return isPositionSafe;
  }

  private findSafeSquares(): SafeSquares {
    const safeSqures: SafeSquares = new Map<string, Coords[]>();

    for (let x = 0; x < this.chessBoardSize; x++) {
      for (let y = 0; y < this.chessBoardSize; y++) {
        const piece: Piece | null = this.chessBoard[x][y];
        if (!piece || piece.color !== this._playerColor) continue;

        const pieceSafeSquares: Coords[] = [];

        for (const { x: dx, y: dy } of piece.directions) {
          let newX: number = x + dx;
          let newY: number = y + dy;

          if (!this.areCoordsValid(newX, newY)) continue;

          let newPiece: Piece | null = this.chessBoard[newX][newY];
          if (newPiece && newPiece.color === piece.color) continue;

          // should restrict pawn's movement in certain directions
          // cannot move pawn if another piece is infront of the pawn
          if (piece instanceof Pawn) {
            // cannot move pawn two squares if another piece is infront of the pawn
            if (dx === 2 || dx === -2) {
              if (newPiece) continue;
              if (this.chessBoard[newX + (dx === 2 ? -1 : 1)][newY]) continue;
            }

            // cannot move pawn one square if another piece is infront of the pawn
            if ((dx === 1 || dx === -1) && dy === 0 && newPiece) continue;

            // cannot attack on diagonal fashion if
            // there is no piece to attack
            // or the piece is of same color as the pawn
            if (
              (dy === 1 || dy === -1) &&
              (!newPiece || piece.color === newPiece.color)
            )
              continue;
          }

          if (
            piece instanceof Pawn ||
            piece instanceof Knight ||
            piece instanceof King
          ) {
            if (this.isPositionSafeAfterMove(piece, x, y, newX, newY))
              pieceSafeSquares.push({ x: newX, y: newY });
          } else {
            while (this.areCoordsValid(newX, newY)) {
              newPiece = this.chessBoard[newX][newY];
              if (newPiece && newPiece.color === piece.color) break;

              if (this.isPositionSafeAfterMove(piece, x, y, newX, newY))
                pieceSafeSquares.push({ x: newX, y: newY });

              if (newPiece !== null) break;

              newX += dx;
              newY += dy;
            }
          }
        }

        if (piece instanceof King) {
          if (this.canCastle(piece, true)) {
            pieceSafeSquares.push({ x, y: 6 });
          }
          if (this.canCastle(piece, false)) {
            pieceSafeSquares.push({ x, y: 2 });
          }
        } else if (
          piece instanceof Pawn &&
          this.canCaptureEnPassant(piece, x, y)
        ) {
          pieceSafeSquares.push({
            x: x + (piece.color === Color.White ? 1 : -1),
            y: this._lastMove!.prevY,
          });
        }

        if (pieceSafeSquares.length) {
          safeSqures.set(x + ',' + y, pieceSafeSquares);
        }
      }
    }

    return safeSqures;
  }

  private canCaptureEnPassant(
    pawn: Pawn,
    pawnX: number,
    pawnY: number
  ): boolean {
    if (this.lastMove === undefined) {
      return false;
    }

    const { piece, prevX, prevY, currX, currY } = this.lastMove;

    if (
      !(piece instanceof Pawn) ||
      pawn.color !== this._playerColor ||
      Math.abs(currX - prevX) !== 2 ||
      pawnX !== currX ||
      Math.abs(pawnY - currY) !== 1
    ) {
      return false;
    }

    const pawnNewPositionX: number =
      pawnX + (pawn.color === Color.White ? 1 : -1);
    const pawnNewPositionY: number = currY;

    this.chessBoard[currX][currY] = null;
    const isPositionSafe: boolean = this.isPositionSafeAfterMove(
      pawn,
      pawnX,
      pawnY,
      pawnNewPositionX,
      pawnNewPositionY
    );
    this.chessBoard[currX][currY] = piece;

    return isPositionSafe;
  }

  private canCastle(king: King, kingSideCastle: boolean): boolean {
    if (king.hasMoved) return false;

    const kingPostionX: number = king.color === Color.White ? 0 : 7;
    const kingPostionY: number = 4;
    const rookPostionX: number = kingPostionX;
    const rookPostionY: number = kingSideCastle ? 7 : 0;
    const rook: Piece | null = this.chessBoard[rookPostionX][rookPostionY];

    // cannot castle if
    // piece is not Rook,
    // rook has been moved from initial place,
    // king is in check
    if (
      !(rook instanceof Rook) ||
      rook.hasMoved ||
      this._checkState.isInCheck
    ) {
      return true;
    }

    const firstNextKingPositionY: number =
      kingPostionY + (kingSideCastle ? 1 : -1);
    const secondNextKingPositionY: number =
      kingPostionY + (kingSideCastle ? 2 : -2);

    if (
      this.chessBoard[kingPostionX][firstNextKingPositionY] ||
      this.chessBoard[kingPostionX][secondNextKingPositionY]
    ) {
      return false;
    }
    if (!kingSideCastle && this.chessBoard[kingPostionX][1]) {
      return false;
    }

    return (
      this.isPositionSafeAfterMove(
        king,
        kingPostionX,
        kingPostionY,
        kingPostionX,
        firstNextKingPositionY
      ) &&
      this.isPositionSafeAfterMove(
        king,
        kingPostionX,
        kingPostionY,
        kingPostionX,
        secondNextKingPositionY
      )
    );
  }

  public move(prevX: number, prevY: number, newX: number, newY: number): void {
    if (
      !this.areCoordsValid(prevX, prevY) ||
      !this.areCoordsValid(newX, newY)
    ) {
      return;
    }
    const piece: Piece | null = this.chessBoard[prevX][prevY];
    if (!piece || piece.color !== this.playerColor) {
      return;
    }

    const pieceSafeSquares: Coords[] | undefined = this._safeSquares.get(
      prevX + ',' + prevY
    );
    if (
      !pieceSafeSquares ||
      !pieceSafeSquares.find(coords => coords.x === newX && coords.y === newY)
    ) {
      throw new Error('Square is not safe');
    }

    if (
      (piece instanceof Pawn ||
        piece instanceof King ||
        piece instanceof Rook) &&
      !piece.hasMoved
    ) {
      piece.hasMoved = true;
    }

    this.handlingSpecialMoves(piece, prevX, prevY, newX, newY);

    this.chessBoard[prevX][prevY] = null;
    this.chessBoard[newX][newY] = piece;

    this._lastMove = { piece, prevX, prevY, currX: newX, currY: newY };
    this._playerColor =
      this._playerColor === Color.White ? Color.Black : Color.White;
    this.isInCheck(this._playerColor, true);
    this._safeSquares = this.findSafeSquares();
  }

  private handlingSpecialMoves(
    piece: Piece,
    prevX: number,
    prevY: number,
    newX: number,
    newY: number
  ): void {
    if (piece instanceof King && Math.abs(newY - prevY) === 2) {
      const rookPositionX: number = prevX;
      const rookPositionY: number = newY > prevY ? 7 : 0;
      const rook = this.chessBoard[rookPositionX][rookPositionY] as Rook;
      const rookNewPositionY: number = newY > prevY ? 5 : 3;
      this.chessBoard[rookPositionX][rookPositionY] = null;
      this.chessBoard[rookPositionX][rookNewPositionY] = rook;
      rook.hasMoved = true;
    } else if (
      piece instanceof Pawn &&
      this._lastMove &&
      this._lastMove.piece instanceof Pawn &&
      Math.abs(this._lastMove.currX - this._lastMove.prevX) === 2 &&
      prevX === this._lastMove.currX &&
      newY === this._lastMove.currY
    ) {
      this.chessBoard[this._lastMove.currX][this._lastMove.currY] = null;
    }
  }
}
