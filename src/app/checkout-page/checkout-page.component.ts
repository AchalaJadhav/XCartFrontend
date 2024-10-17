import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../services/data-transfer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AddressDialogComponent } from './address-dialog/address-dialog.component';
import { AddressFetchingService } from '../services/address-fetching.service';

interface checkoutData {
  price: number;
  discount: number;
  deliveryCharges: number;
  totalAmount: number;
  totalItems: number;
}

interface userAddresses {
    detailAddressId: string; // or number if appropriate
    addressType: string;
    contactNumber1: number;
    contactNumber2?: number; // optional if not always provided
    houseDetails: string;
    addressLine: string;
    pincode: number; // could be number if you prefer
    city: string;
    state: string;
    country: string;
}

interface Address {
  id: string;
  userId: string;
  userAddresses: userAddresses[];
}

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit{
  private _formBuilder = inject(FormBuilder);
  isEditable = true;
  checkoutData: any[] = [];
  loading: boolean = true; // Loading state
  private _snackBar = inject(MatSnackBar);
  price!: number;
  discount!: number;
  deliveryCharges!: number;
  totalAmount!: number;
  totalItems!: number;
  favoriteSeason!: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  addedAddresses! : any[];
  address! : string;
  userId!: string;
  imageBasePath = environment.imageBasePath;
  userName!: string;
  readonly dialog = inject(MatDialog);

  constructor(private authService: AuthService, private router: Router, 
              private route: ActivatedRoute, private dataService: DataTransferService,
              private toastr: ToastrService, private addressService: AddressFetchingService) {}


  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
    favoriteSeason: ['', Validators.required],  // Bind radio group here
    address: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  
  ngOnInit(): void {
    this.checkoutData = this.dataService.getCheckoutData();
    console.log('Checkout Data:', this.checkoutData);

    this.userId = this.authService.getUserId() || ''; // Provide a fallback value of an empty string
    this.userName = this.authService.getUserName() || ''; // Provide a fallback value of an empty string
      
    if (this.userId) { // Ensure both userId are non-empty
      this.addressService.getAddressById(this.userId).subscribe({
        next: (data: Address) => {
          this.addedAddresses = data.userAddresses; // Assign the fetched cart data to cartItems
          // Loop through each cart item and build the full image path
          this.addedAddresses.forEach(item => {
            item.imagePath = `${this.imageBasePath}${item.path}`; // Append the path
          });
          console.log('Added addresses:', this.addedAddresses); // For debugging
          //For total price in cart
          // this.calculateCartSummary();
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
        document.title = "Checkout | XCart";
    });
  }
  
  // Calculate total price, discount, and amount
  calculateCartSummary(): void {

    //to calculate the cart items
    this.totalItems = this.checkoutData.length;

    // Calculate total price
    this.price = this.checkoutData.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Calculate total discount
    this.discount = this.checkoutData.reduce(
      (acc, item) => acc + (item.price * item.productDiscount) / 100 * item.quantity,
      0
    );

    // Delivery is free if the total price is over 1000
    this.deliveryCharges = this.price > 1000 ? 0 : 50;

    // Calculate total amount
    this.totalAmount = this.price - this.discount + this.deliveryCharges;
  }

  //add user address
  addUserAddress(useraddress: string[]) {
    const userId = this.authService.getUserId() || ''; // Provide a fallback value of an empty string
  
    this.addressService.addUserAddress(userId, useraddress).subscribe({
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

  //open dialog to add user address form
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(AddressDialogComponent, {
      width: '1000px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
