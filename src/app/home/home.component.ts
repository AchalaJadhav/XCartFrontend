import { Component, OnInit } from '@angular/core';
import { Product } from '../product/product.model';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = []; // Array to hold products
  loading: boolean = true; // Loading state

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProducts().subscribe({
      next: (data: Product[]) => {
        // Assuming data has the path as a relative URL
        this.products = data.map(product => ({
          ...product,
          fullImagePath: environment.imageBasePath + product.path // Combine base path with image path
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.loading = false;
      }
    });
  }
}
