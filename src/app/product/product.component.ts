import { Component, Input, OnInit } from '@angular/core';
import { Product } from './product.model';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent{
  @Input() product!: Product; // Ensure this property is defined

  constructor(private authService: AuthService, private toastr: ToastrService) {}

  get productImagePath(): string {
    // return `${environment.imageBasePath}${this.product.path}`; // Construct the full image path
    return `src/assets/Products/samsung_galaxy_s23_ultra.png`;
  }
  
  addToCart(): void {
    const userId = '6702e2fde2521409b4a1856c';  // Replace with dynamic user ID if available
    const productId = this.product.id;

    const quantity = 1;

    this.authService.addToCart(userId, productId, quantity).subscribe({
      next: () => {
        this.toastr.success('Product added to cart');
      },
      error: (error) => {
        this.toastr.error('Failed to add product to cart');
        console.error('Add to Cart error:', error);
      }
    });
  }

  buyNow() {
    console.log(`Buying ${this.product.productName}`);
    // Implement your buy now logic here, e.g., redirect to checkout
  }
}
