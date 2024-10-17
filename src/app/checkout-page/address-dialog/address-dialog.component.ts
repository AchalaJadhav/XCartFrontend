import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddressFetchingService } from 'src/app/services/address-fetching.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataTransferService } from 'src/app/services/data-transfer.service';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.css']
})
export class AddressDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddressDialogComponent>);
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;
  fifthFormGroup!: FormGroup;

  isEditable = true;
  loading: boolean = true; // Loading state
  private _snackBar = inject(MatSnackBar);
  userId!: string;
  countries: string[] = [];
  states: string[] = [];
  cities: string[] = [];
  talukas: string[] = [];
  pincodes: string[] = [];
  selectedCountry: string = '';
  selectedState: string = '';
  selectedCity: string = '';
  selectedTaluka: string = '';

  constructor(private authService: AuthService, private router: Router, private addressService: AddressFetchingService,
              private route: ActivatedRoute, private toastr: ToastrService, private dataService: DataTransferService,
              private _formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      country: ['', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      state: ['', Validators.required],
    });

    this.thirdFormGroup = this._formBuilder.group({
      city: ['', Validators.required],
    });

    this.fourthFormGroup = this._formBuilder.group({
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });

    this.fifthFormGroup = this._formBuilder.group({
      addressType: ['', Validators.required],
      contactNumber1: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      contactNumber2: ['', [Validators.pattern('^[0-9]{10}$')]],
      houseDetails: ['', Validators.required],
      addressLine: ['', Validators.required],
    });


    this.userId = this.authService.getUserId() || ''; 
    this.fetchCountries();
  }

  // Method to handle selection of country
  onSelect(type: string, value: string) {
    switch (type) {
      case 'country':
        this.selectedCountry = value;
        this.dataService.setCountry(this.selectedCountry); // Pass the selected country
        this.fetchStates(value); // Fetch states based on selected country
        break;
      case 'state':
        this.selectedState = value;
        this.fetchCities(value); // Fetch cities based on selected state
        break;
      case 'city':
        this.selectedCity = value;
        this.fetchPincodes(value); // Fetch pincodes based on selected city
        break;
      // case 'taluka':
      //   this.selectedTaluka = value;
      //   this.fetchPincodes(value); // Fetch pincodes based on selected city
      //   break;
    }
  }
  
  // Fetch countries on initialization
  fetchCountries() {
    this.addressService.getCountries().subscribe((data: string[]) => {
      this.countries = data;
    });
  }

  // Fetch states for a selected country
  fetchStates(country: string) {
    this.addressService.getStates(country).subscribe((data: string[]) => {
      this.states = data;
    });
  }

  // Fetch cities for a selected state
  fetchCities(state: string) {
    this.addressService.getCities(state).subscribe((data: string[]) => {
      this.cities = data;
    });
  }

  // Fetch talukas for a selected city
  fetchTalukas(city: string) {
    this.addressService.getTalukas(city).subscribe((data: string[]) => {
      this.talukas = data;
    });
  }

  // Fetch pincodes for a selected taluka
  fetchPincodes(city: string) {
    this.addressService.getPincodes(city).subscribe((data: string[]) => {
      this.pincodes = data;
    });
  }

  onSubmit(): void {
    if (
      this.firstFormGroup.valid &&
      this.secondFormGroup.valid &&
      this.thirdFormGroup.valid &&
      this.fourthFormGroup.valid &&
      this.fifthFormGroup.valid
    ) {
      const addressData = {
        addresstype: this.fifthFormGroup.value.addressType,
        contactNumber1: this.fifthFormGroup.value.contactNumber1,
        contactNumber2: this.fifthFormGroup.value.contactNumber2,
        houseDetails: this.fifthFormGroup.value.houseDetails,
        addressLine: this.fifthFormGroup.value.addressLine,
        pincode: this.fourthFormGroup.value.pincode,
        city: this.thirdFormGroup.value.city,
        state: this.secondFormGroup.value.state,
        country: this.firstFormGroup.value.country,
      };

      // console.log('Address Data:', addressData);
      // Handle form submission logic (e.g., send to backend)

      const userId = this.authService.getUserId() || ''; // Provide a fallback value of an empty string
      const userAddresses: [typeof addressData] = [addressData]; // Pass as array

      this.addressService.addUserAddress(userId, userAddresses).subscribe({
        next: (response) => {
          // Close the dialog and navigate to /checkout with a reload
          this.dialogRef.close();
          this.router.navigate(['/checkout']).then(() => {
            window.location.reload();  // Force reload
          });
          this._snackBar.open("Address added successfully", "Close", {
            duration: 3000, // Duration in milliseconds (3000ms = 3 seconds)
            panelClass: 'custom-snackbar', // Custom class for styling
            verticalPosition: 'top', // Set the vertical position to top
            horizontalPosition: 'right' // Optional: Set horizontal position
          });
        },
        error: (err) => {
          console.error('Error adding address:', err);
          this._snackBar.open("Error adding address", "Close", {
            duration: 3000,
            panelClass: 'custom-snackbar',
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      });
    }
  }
}