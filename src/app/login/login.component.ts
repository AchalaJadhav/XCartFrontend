import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService // Inject ToastrService
  ) {
    // Initialize the login form
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]], // Adjusted for username input
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Any additional initialization can be done here
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return; // Don't submit the form if it's invalid
    }

    this.loading = true; // Show loading spinner

    const { username, password } = this.loginForm.value;

    // Call the login method in AuthService with a single object argument
    this.authService.login({ username, password }).subscribe({
      next: (response) => {
        this.loading = false; // Hide loading spinner

        // Save JWT token to local storage
        localStorage.setItem('jwt', response.token); // Adjust based on your API response structure
        // Store the token in local storage
        const token = response.token;
        if (token) {
            localStorage.setItem('jwt', token);
        }
        // Show success message
        this.toastr.success('Login successful', 'Success');

        // Navigate to home page after successful login
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Login failed', error);
        // Show error message as toast notification
        const errorMessage = error.error ? error.error : 'Login failed, please try again.';
        this.toastr.error(errorMessage, 'Login Error'); // Display the error notification
      },
    });
  }
}
