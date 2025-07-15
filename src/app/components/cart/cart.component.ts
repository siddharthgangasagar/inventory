import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 89.99,
      image: 'https://via.placeholder.com/150x150/7474e9/ffffff?text=Headphones',
      quantity: 1
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      description: 'Track your fitness goals with this advanced smartwatch',
      price: 199.99,
      image: 'https://via.placeholder.com/150x150/5a5ad1/ffffff?text=Watch',
      quantity: 2
    },
    {
      id: 3,
      name: '4K Ultra HD Smart TV - 55"',
      description: 'Crystal clear 4K resolution with built-in streaming apps and voice control',
      price: 799.99,
      image: 'https://via.placeholder.com/150x150/9C27B0/ffffff?text=Smart+TV',
      quantity: 1
    }
  ];

  subtotal = computed(() => {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  tax = computed(() => {
    return this.subtotal() * 0.08;
  });

  total = computed(() => {
    return this.subtotal() + this.tax();
  });

  increaseQuantity(item: CartItem) {
    item.quantity++;
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  removeFromCart(item: CartItem) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
  }

  checkout() {
    alert('Proceeding to checkout... Total: $' + this.total().toFixed(2));
  }
}
