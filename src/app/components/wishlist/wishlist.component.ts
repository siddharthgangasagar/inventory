import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface WishlistItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  wishlistItems: WishlistItem[] = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 89.99,
      image: 'https://via.placeholder.com/150x150/7474e9/ffffff?text=Headphones'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      description: 'Track your fitness goals with this advanced smartwatch',
      price: 199.99,
      image: 'https://via.placeholder.com/150x150/5a5ad1/ffffff?text=Watch'
    },
    {
      id: 3,
      name: 'Portable Bluetooth Speaker',
      description: 'Compact speaker with amazing sound quality',
      price: 59.99,
      image: 'https://via.placeholder.com/150x150/4CAF50/ffffff?text=Speaker'
    },
    {
      id: 4,
      name: 'Gaming Laptop - RTX 4060',
      description: 'High-performance gaming laptop with RTX 4060 graphics card, 16GB RAM, 512GB SSD',
      price: 1299.99,
      image: 'https://via.placeholder.com/150x150/FF6B35/ffffff?text=Gaming+Laptop'
    }
  ];

  addToCart(item: WishlistItem) {
    // In a real app, this would add to cart service
    alert(`Added ${item.name} to cart!`);
  }

  removeFromWishlist(item: WishlistItem) {
    this.wishlistItems = this.wishlistItems.filter(wishlistItem => wishlistItem.id !== item.id);
  }
}
