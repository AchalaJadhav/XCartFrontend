import { Component, OnInit } from '@angular/core'; // Import OnInit
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr'; // Remove ToastrModule import as it’s not needed here
import { environment } from 'src/environments/environment';
import { Product } from './product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit { // Implement OnInit
  product!: Product; // Ensure this property is defined, no need for @Input if fetched via service
  loading: boolean = true; // Loading state
  productName: string | null = null;
  imageBasePath = environment.imageBasePath;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id'); // Get the productId from the route
    if (productId) {
      this.authService.getProductById(productId).subscribe({
        next: (data: Product) => {
          this.product = data; // Assign the fetched product data
          this.product.imagePath = `${this.imageBasePath}${data.productImagePath}`;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching product details:', error);
          this.toastr.error('Failed to load product details'); // Notify user about the error
          this.loading = false;
        }
      });
    }

    //To change the tab name
    // Get the product name from the query parameter
    this.route.queryParamMap.subscribe(params => {
      this.productName = params.get('name');

      // Set the tab title to the product's name
      if (this.productName) {
        document.title = this.productName;
      }
    });
  }

  addToCart(): void {
    const userId = this.authService.getUserId() || ''; // Get user ID dynamically
    console.log('Retrieved User ID:', userId); // Debug log
    const productId = this.product.id; // Get product ID
    const quantity = 1; // You can change this based on your input

    if (!userId) {
        console.error('User ID not found. Please log in.');
        localStorage.setItem('redirectPath', JSON.stringify({ path: '/cart', productId })); // Store path
        this.router.navigate(['/login']); // Handle the case where the user is not logged in
    }

    this.loading = true; // Optional: set loading state

    this.authService.addToCart(userId, productId, quantity).subscribe({
        next: (response) => {
            console.log('Product added to cart:', response);
            this.loading = false; // Reset loading state
            
            // Redirect to ProductCartComponent
            this.router.navigate(['/cart', productId]); // Ensure '/cart' matches your routing setup
        },
        error: (error) => {
            console.error('Error adding product to cart:', error);
            this.loading = false; // Reset loading state
        }
    });
  }


  buyNow(): void { // Specify the return type
    console.log(`Buying ${this.product.productName}`);
    // Implement your buy now logic here, e.g., redirect to checkout
  }

  getOriginalPrice(product: Product): number {
    return product.price / (1 - product.productDiscount / 100);
  }
}
