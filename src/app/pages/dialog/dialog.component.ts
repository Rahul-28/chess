import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Color } from '../../chess-logic/models';
import { StockfishService } from '../computer-mode/stockfish.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  public stockfishLevels: readonly number[] = [1, 2, 3, 4, 5];
  public stockfishLevel: number = 1;

  constructor(
    private stockfishService: StockfishService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  public selectStockfishLevel(level: number): void {
    this.stockfishLevel = level;
  }

  public play(color: 'w' | 'b'): void {
    this.dialog.closeAll();
    this.stockfishService.computerConfiguration$.next({
      color: color === 'w' ? Color.Black : Color.White,
      level: this.stockfishLevel,
    });
    this.router.navigate(['computer']);
  }

  public closeDialog(): void {
    this.router.navigate(['against-friend']);
  }
}
