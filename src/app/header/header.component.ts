import { Component, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // Track login status
  userName: string | null = null; // Store the user's name
  private _snackBar = inject(MatSnackBar);

  constructor(private authService: AuthService, private router: Router,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn; // Update the local state based on the observable
    });
  }

  login(): void {
    this.router.navigate(['/login']); // Navigate to the login page
  }

  logout(): void {
    this.authService.logout(); // Call logout method from AuthService
    // this.isLoggedIn = false; // Update the login status
    this.userName = null; // Clear the user's name
    this.router.navigate(['/home']); // Navigate back to the home page
    this._snackBar.open("User needs to login", "Close", {
      duration: 3000,
      panelClass: 'custom-snackbar',
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}