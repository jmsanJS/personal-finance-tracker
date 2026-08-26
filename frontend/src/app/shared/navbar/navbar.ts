import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);
  isOpen = signal(false);

  toggleMenu(): void {
    this.isOpen.set(!this.isOpen());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
