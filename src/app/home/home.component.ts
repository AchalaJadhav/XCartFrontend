import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Product } from '../product-detail/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = []; // Array to hold products
  loading: boolean = true; // Loading state
  imageBasePath = environment.imageBasePath;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.authService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data.map(product => ({
          ...product, // Spread the existing product properties
          imagePath: `${this.imageBasePath}${product.path}` // Construct the image path for each product
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  productClick(productId: string, productName: string){
    this.authService.getProductById(productId).subscribe({
      next: (product: Product) => {
        console.log('Product details:', product);
        // Navigate to the product detail page
        const newUrl = this.router.serializeUrl(
          this.router.createUrlTree(['/product', productId], { queryParams: { name: productName } })
        );
        
        window.open(newUrl, '_blank');
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
  }
}
