import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService, UserData } from '../../services/user.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  currentUser: UserData | null = null;
  userStats = {
    ordersCount: 12,
    wishlistCount: 8,
    cartCount: 3,
    recentActivity: 5
  };

  recentOrders = [
    { id: 'ORD-001', date: '2024-01-15', total: 299.99, status: 'Delivered' },
    { id: 'ORD-002', date: '2024-01-10', total: 159.99, status: 'Shipped' },
    { id: 'ORD-003', date: '2024-01-05', total: 89.99, status: 'Processing' }
  ];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
  }

  logout() {
    this.userService.logoutUser();
    window.location.href = '/login';
  }

  updateProfile() {
    // Navigate to profile update page
    console.log('Navigate to profile update');
  }

  viewOrders() {
    console.log('Navigate to orders page');
  }

  viewWishlist() {
    console.log('Navigate to wishlist page');
  }

  viewCart() {
    console.log('Navigate to cart page');
  }
}