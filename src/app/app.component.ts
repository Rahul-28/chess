import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChessBoardComponent } from './pages/chess-board/chess-board.component';
import { NavMenuComponent } from './pages/nav-menu/nav-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChessBoardComponent, NavMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'chess';
}
