import { Routes } from '@angular/router';
import { ChessBoardComponent } from './pages/chess-board/chess-board.component';
import { ComputerModeComponent } from './pages/computer-mode/computer-mode.component';

export const routes: Routes = [
  {
    path: 'against-friend',
    component: ChessBoardComponent,
    title: 'play against friend',
  },
  {
    path: 'computer',
    component: ComputerModeComponent,
    title: 'play against computer',
  },
];
