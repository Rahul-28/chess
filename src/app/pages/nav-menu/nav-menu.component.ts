import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink, RouterOutlet],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css',
})
export class NavMenuComponent {}
