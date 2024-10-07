import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from  '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;  // FormGroup for managing form controls
  loading = false;  // Control for showing spinner

  
  constructor(
    private fb: FormBuilder,  // Inject FormBuilder
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Initialize the form
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],  // Email validator
      password: ['', [Validators.required, Validators.minLength(6)]],  // Minimum length validator
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['MALE'],  // Default value
      dateOfBirth: ['', Validators.required],
      role: ['USER'],  // Default value
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
      status: ['ACTIVE'],  // Default value
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]  // Pattern validator for mobile
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.loading = true;  // Show spinner
  
      // Prepare the signup data from the form
      const signupData = {
        username: this.signupForm.value.username,
        password: this.signupForm.value.password,
        firstName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName,
        gender: this.signupForm.value.gender,
        dateOfBirth: this.signupForm.value.dateOfBirth,
        role: this.signupForm.value.role,
        securityQuestion: this.signupForm.value.securityQuestion,
        securityAnswer: this.signupForm.value.securityAnswer,
        status: this.signupForm.value.status,
        mobileNumber: this.signupForm.value.mobileNumber
      };
  
      this.authService.signup(signupData).subscribe({
        next: (response) => {
          this.loading = false; // Hide spinner on success
          this.toastr.success('Signup successful!', 'Success');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading = false; // Hide spinner on error
          console.error('Signup failed', error);
          
          // Check if error response contains JSON format
          let errorMessage = 'Signup failed, please try again.';
          
          if (error.error && error.error.error) { // Access the error message from the JSON response
            errorMessage = error.error.error; // Get the error message from the error response
          } else if (error.error) {
            errorMessage = error.error; // Fallback for non-JSON responses
          }
        
          this.toastr.error(errorMessage, 'Signup Error');
        },
        
      });
    } else {
      // Form is invalid; show an error message
      this.toastr.error('Please fill in all required fields correctly.', 'Form Error');
    }
  }
  
}
