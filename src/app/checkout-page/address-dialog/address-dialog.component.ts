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
      pincode: ['', Validators.required],
    });

    // this.fifthFormGroup = this._formBuilder.group({
    //   pincode: ['', Validators.required],
    // });


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


  // getStates(country: string) {
  //   if (this.userId) { // Ensure userId is non-empty
  //     this.addressService.getStates(country).subscribe({
  //       next: (data) => {
  //         this.dataService.setState(data); // Assuming data is an array of states
  //       },
  //       error: (error) => {
  //         console.error('Error fetching states:', error);
  //         this.toastr.error('Error fetching states: ', error);
  //       }
  //     });
  //   } else {
  //     console.error('User ID not found. Please log in.');
  //     this.toastr.error('User ID not found. Please log in.');
  //     this.router.navigate(['/login']); 
  //   }
  // }

  // getCities(state: string) {
  //   // Implement your logic to fetch cities based on the selected state
  //   // Call the relevant service method to fetch cities
  //   this.addressService.getCities(state).subscribe({
  //     next: (data) => {
  //       this.dataService.setCities(data); // Assuming data is an array of cities
  //     },
  //     error: (error) => {
  //       console.error('Error fetching cities:', error);
  //       this.toastr.error('Error fetching cities: ', error);
  //     }
  //   });
  // }

  // getTalukas(city: string) {
  //   // Implement your logic to fetch talukas based on the selected city
  //   this.addressService.getTalukas(city).subscribe({
  //     next: (data) => {
  //       this.dataService.setTalukas(data); // Assuming data is an array of talukas
  //     },
  //     error: (error) => {
  //       console.error('Error fetching talukas:', error);
  //       this.toastr.error('Error fetching talukas: ', error);
  //     }
  //   });
  // }

  // getPincodes(taluka: string) {
  //   // Implement your logic to fetch pincodes based on the selected taluka
  //   this.addressService.getPincodes(taluka).subscribe({
  //     next: (data) => {
  //       this.dataService.setPincode(data); // Assuming data is an array of pincodes
  //     },
  //     error: (error) => {
  //       console.error('Error fetching pincodes:', error);
  //       this.toastr.error('Error fetching pincodes: ', error);
  //     }
  //   });
  // }

  // getCountries() {      
  //   if (this.userId) { // Ensure userId is non-empty
  //     this.addressService.getCountries().subscribe({
  //       next: (data) => {
  //         this.selectedCountry = data; // Assuming data is an array of countries
  //         this.dataService.setCountry(this.selectedCountry);
  //       },
  //       error: (error) => {
  //         console.error('Error fetching countries:', error);
  //         this.toastr.error('Error fetching countries: ', error);
  //       }
  //     });
  //   } else {
  //     console.error('User ID not found. Please log in.');
  //     this.toastr.error('User ID not found. Please log in.'); 
  //     this.router.navigate(['/login']); 
  //   }
  // }
}