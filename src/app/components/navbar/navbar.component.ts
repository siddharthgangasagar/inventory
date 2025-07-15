import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router) {}

  goToLogin() {
    console.log('Login button clicked');
    this.router.navigate(['/login']);
  }

  goToWishlist() {
    console.log('Wishlist button clicked');
    this.router.navigate(['/wishlist']);
  }

  goToCart() {
    console.log('Cart button clicked');
    this.router.navigate(['/cart']);
  }
}
