import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MoveList } from '../../chess-logic/models';

@Component({
  selector: 'app-move-history',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './move-history.component.html',
  styleUrl: './move-history.component.css',
})
export class MoveHistoryComponent {
  @Input({ required: true }) public moveList!: MoveList;
  @Input({ required: true }) public gameHistoryPointer: number = 0;
  @Input({ required: true }) public gameHistoryLength: number = 1;
  @Output() public showPreviousPositionEvent = new EventEmitter<number>();

  public showPreviousPosition(moveIndex: number): void {
    this.showPreviousPositionEvent.emit(moveIndex);
  }
}
