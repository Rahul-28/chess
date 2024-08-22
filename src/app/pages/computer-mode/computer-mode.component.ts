import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { CommonModule } from '@angular/common';
import { StockfishService } from './stockfish.service';
import { ChessBoardService } from '../chess-board/chess-board.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Color } from '../../chess-logic/models';

@Component({
  selector: 'app-computer-mode',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: '../chess-board/chess-board.component.html',
  styleUrl: '../chess-board/chess-board.component.css',
})
export class ComputerModeComponent
  extends ChessBoardComponent
  implements OnInit, OnDestroy
{
  private computerSubscriptions$ = new Subscription();

  constructor(private stockfishService: StockfishService) {
    super(inject(ChessBoardService));
  }

  public ngOnInit(): void {
    const computerConfiSubscription$: Subscription =
      this.stockfishService.computerConfiguration$.subscribe({
        next: computerConfiguration => {
          if (computerConfiguration.color === Color.White) this.flipBoard();
        },
      });

    const chessBoardStateSubscription$: Subscription =
      this.chessBoardService.chessBoardState$.subscribe({
        next: async (FEN: string) => {
          if (this.chessBoard.isGameOver) {
            chessBoardStateSubscription$.unsubscribe();
            return;
          }

          const player: Color =
            FEN.split(' ')[1] === 'w' ? Color.White : Color.Black;
          if (
            player !== this.stockfishService.computerConfiguration$.value.color
          )
            return;

          const { prevX, prevY, newX, newY, promotedPiece } =
            await firstValueFrom(this.stockfishService.getBestMove(FEN));
          this.updateBoard(prevX, prevY, newX, newY, promotedPiece);
        },
      });

    this.computerSubscriptions$.add(chessBoardStateSubscription$);
    this.computerSubscriptions$.add(computerConfiSubscription$);
  }

  public ngOnDestroy(): void {
    this.computerSubscriptions$.unsubscribe();
  }
}
