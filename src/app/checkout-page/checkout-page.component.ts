import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../services/data-transfer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  price: number = 0;
  discount: number = 0;
  deliveryCharges: number = 50;
  totalAmount: number = 0;
  totalItems: number = 0;
  favoriteSeason!: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  constructor(private authService: AuthService, private router: Router, 
              private route: ActivatedRoute, private dataService: DataTransferService) {}


  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
    favoriteSeason: ['', Validators.required],  // Bind radio group here
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  
  ngOnInit(): void {
    this.checkoutData = this.dataService.getCheckoutData();
    console.log('Checkout Data:', this.checkoutData);
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
}
