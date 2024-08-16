import { Component } from '@angular/core';
import { chessBoard } from '../../chess-logic/chess-board';
import { Color, FENChar, pieceImagePaths } from '../../chess-logic/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.css',
})
export class ChessBoardComponent {
  private chessBoard = new chessBoard();

  public pieceImagePath = pieceImagePaths;
  public chessBoardView: (FENChar | null)[][] = this.chessBoard.chessBoardView;
  public get playerColor(): Color {
    return this.chessBoard.playerColor;
  }

  public isSquareBlack(x: number, y: number): boolean {
    return chessBoard.isSquareblack({ x, y });
  }
}
