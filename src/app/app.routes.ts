import { Routes } from '@angular/router';
import { ChessBoardComponent } from './pages/chess-board/chess-board.component';
import { ComputerModeComponent } from './pages/computer-mode/computer-mode.component';

export const routes: Routes = [
  {
    path: 'playing-against-friend',
    component: ChessBoardComponent,
    title: 'play against friend',
  },
  {
    path: 'playing-against-computer',
    component: ComputerModeComponent,
    title: 'play against computer',
  },
  // handling empty & wildcard routes
  {
    path: ' ',
    redirectTo: 'playing-against-friend',
  },
  {
    path: '**',
    redirectTo: 'playing-against-friend',
  },
];
