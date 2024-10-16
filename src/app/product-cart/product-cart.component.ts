import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Product } from '../product-detail/product.model';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataTransferService } from '../services/data-transfer.service';


interface CartItem {
  productId: string;
  quantity: number;
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.css']
})
export class ProductCartComponent implements OnInit{

  userId: string = ''; // Initialize userId as an empty string
  product!: Product; // Ensure this property is defined, no need for @Input if fetched via service
  quantity: number = 1; // Replace with the actual quantity if needed
  cartItems: any[] = []; // To hold the cart items
  imageBasePath = environment.imageBasePath;
  productId!: string; // Declare the productId variable
  loading: boolean = true; // Loading state
  private _snackBar = inject(MatSnackBar);
  price: number = 0;
  discount: number = 0;
  deliveryCharges: number = 50;
  totalAmount: number = 0;
  totalItems: number = 0;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute,
              private toastr: ToastrService, private dataService: DataTransferService) {}


  ngOnInit(): void {    
    this.userId = this.authService.getUserId() || ''; // Provide a fallback value of an empty string
    
    console.log('User ID:', this.userId); // Log the user ID
  
    if (this.userId) { // Ensure both userId are non-empty
      this.authService.getCart(this.userId).subscribe({
        next: (data: Cart) => {
          this.cartItems = data.items; // Assign the fetched cart data to cartItems
          // Loop through each cart item and build the full image path
          this.cartItems.forEach(item => {
            item.imagePath = `${this.imageBasePath}${item.path}`; // Append the path
          });
          console.log('Cart items:', this.cartItems); // For debugging
          //For total price in cart
          this.calculateCartSummary();
        },
        error: (error) => {
          console.error('Error fetching cart:', error);
          this.toastr.error('Error fetching cart: ', error);
        }
      });
    } else {
      console.error('User ID or Product ID not found. Please log in.');
      this.toastr.error('User ID or Product ID not found. Please log in.'); // Display the error notification
      this.router.navigate(['/login']); // Redirect to login if user ID is not found
    }

    //To change the tab name
    this.route.queryParamMap.subscribe(params => {
      // Set the tab title to the shopping page name
        document.title = "Shopping Cart | XCart";
    });

    //Delete this afterwards
    this.dataService.setCheckoutData({ userId: this.userId , cartItems: this.cartItems})
  }
  
  getProductForCart(productId: string){
    // Call a service method to get product details
    this.authService.getProductById(productId).subscribe({
      next: (productDetails) => {
          console.log('Product Details:', productDetails);
      },
      error: (error) => {
          console.error('Error fetching product details:', error);
          this.toastr.error('Error fetching product details: ', error);
      }
    });
  }

  getOriginalPrice(product: Product): number {
    return product.price / (1 - product.productDiscount / 100);
  }

  productClick(productId: string, productName: string){
    this.authService.getProductById(productId).subscribe({
      next: (product: Product) => {
        console.log('Product details:', product);
        // Navigate to the product detail page
        const newUrl = this.router.serializeUrl(
          this.router.createUrlTree(['/product', productId], { queryParams: { name: productName } })
        );
        
        window.open(newUrl, '_self');
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
  }

  increaseQuantity(productId: string) {
    const userId = this.authService.getUserId() || ''; // Provide a fallback value of an empty string
    console.log("User Id: " + userId, "Product Id: " + productId);
  
    this.authService.increaseProductById(userId, productId).subscribe({
      next: (response) => {
        if (response.items) { // Check if the items array is present in the response
          // Find the item in the response that matches the productId
          const item = response.items.find((item: { productId: string }) => item.productId === productId);
  
          if (item) {
            this.quantity = item.quantity; // Update quantity from the response
            this.ngOnInit(); // Force reload
            console.log('Updated product details:', item);
            this._snackBar.open("Product updated", "Close", {
              duration: 3000, // Duration in milliseconds (3000ms = 3 seconds)
              panelClass: 'custom-snackbar', // Custom class for styling
              verticalPosition: 'top', // Set the vertical position to top
              horizontalPosition: 'right' // Optional: Set horizontal position
            });
          } else {
            // Handle case where productId is not found in the items array
            console.error('Product ID not found in the response:', productId);
            this._snackBar.open("Product ID not found in the response", "Close", {
              duration: 3000,
              panelClass: 'custom-snackbar',
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          }
        } else {
          // Handle case where items array is missing in the response
          console.error('Response does not contain items:', response);
          this._snackBar.open("Response does not contain items", "Close", {
            duration: 3000,
            panelClass: 'custom-snackbar',
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      },
      error: (err) => {
        console.error('Error updating product:', err);
        this._snackBar.open("Error updating product", "Close", {
          duration: 3000,
          panelClass: 'custom-snackbar',
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }
  

  decreaseQuantity(productId: string) {
    const userId = this.authService.getUserId() || ''; // Provide a fallback value of an empty string
    console.log("User Id: " + userId, "Product Id: " + productId);
  
    this.authService.decreaseProductById(userId, productId).subscribe({
      next: (response) => {
        if (response.items) { // Check if the items array is present in the response
          // Find the item in the response that matches the productId
          const item = response.items.find((item: { productId: string }) => item.productId === productId);
  
          if (item) {
            this.quantity = item.quantity; // Update quantity from the response
            this.ngOnInit(); // Force reload
            console.log('Updated product details:', item);
            this._snackBar.open("Product updated", "Close", {
              duration: 3000, // Duration in milliseconds (3000ms = 3 seconds)
              panelClass: 'custom-snackbar', // Custom class for styling
              verticalPosition: 'top', // Set the vertical position to top
              horizontalPosition: 'right' // Optional: Set horizontal position
            });
          } else {
            // Handle case where productId is not found in the items array
            console.error('Product ID not found in the response:', productId);
            this._snackBar.open("Product ID not found in the response", "Close", {
              duration: 3000,
              panelClass: 'custom-snackbar',
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          }
        } else {
          // Handle case where items array is missing in the response
          console.error('Response does not contain items:', response);
          this._snackBar.open("Response does not contain items", "Close", {
            duration: 3000,
            panelClass: 'custom-snackbar',
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      },
      error: (err) => {
        console.error('Error updating product:', err);
        this._snackBar.open("Error updating product", "Close", {
          duration: 3000,
          panelClass: 'custom-snackbar',
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }
  
  removeProductFromCart(productId: string) {
    const userId = this.authService.getUserId() || ''; // Provide a fallback value of an empty string
    console.log("User Id: " + userId, "Product Id: " + productId);
  
    this.authService.removeProductById(userId, productId).subscribe({
      next: (response) => {
        this.ngOnInit();
        this._snackBar.open("Product removed", "Close", {
          duration: 3000, // Duration in milliseconds (3000ms = 3 seconds)
          panelClass: 'custom-snackbar', // Custom class for styling
          verticalPosition: 'top', // Set the vertical position to top
          horizontalPosition: 'right' // Optional: Set horizontal position
        });
      },
      error: (err) => {
        console.error('Error updating product:', err);
        this._snackBar.open("Error updating product", "Close", {
          duration: 3000,
          panelClass: 'custom-snackbar',
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }


  // Calculate total price, discount, and amount
  calculateCartSummary(): void {
    //to calculate the cart items
    this.totalItems = this.cartItems.length;

    // Calculate total price
    this.price = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Calculate total discount
    this.discount = this.cartItems.reduce(
      (acc, item) => acc + (item.price * item.productDiscount) / 100 * item.quantity,
      0
    );

    // Delivery is free if the total price is over 1000
    this.deliveryCharges = this.price > 1000 ? 0 : 50;

    // Calculate total amount
    this.totalAmount = this.price - this.discount + this.deliveryCharges;
  }

  goToCheckout(){
    // Pass user details and cart items to the checkout page
    this.dataService.setCheckoutData({ userId: this.userId , cartItems: this.cartItems})
    this.router.navigate(['/checkout']);
  }
}
