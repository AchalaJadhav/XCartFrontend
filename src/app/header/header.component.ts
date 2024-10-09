import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // Track login status
  userName: string | null = null; // Store the user's name

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('jwt'); // Check if JWT exists
    if (this.isLoggedIn) {
      this.userName = this.authService.getUserName(); // Get the logged-in user's name
    }
  }

  login(): void {
    this.router.navigate(['/login']); // Navigate to the login page
  }

  logout(): void {
    this.authService.logout(); // Call logout method from AuthService
    this.isLoggedIn = false; // Update the login status
    this.userName = null; // Clear the user's name
    this.router.navigate(['/home']); // Navigate back to the home page
  }
}