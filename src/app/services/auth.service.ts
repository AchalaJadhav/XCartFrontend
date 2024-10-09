import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Product } from '../product-detail/product.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8182/auth';  // Base URL for your authentication API
  private productsUrl = 'http://localhost:8182/product'; // Base URL for getting products
  private cartUrl = 'http://localhost:8182/cart'; // Base URL for cart functionality

  constructor(private http: HttpClient,
              private router: Router,
              private jwtHelper: JwtHelperService
    ) {}

  // Method to handle signup
  signup(signupData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, signupData);
  }

  // Method to handle login
  login(credentials: { username: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        const token = response.token;  
        if (token) {
          localStorage.setItem('jwt', token); // Ensure to store with the same key
        }
      })
    );
  }

  // Get all products method
  getAllProducts(): Observable<Product[]> {
    // Fetch products with the correct URL and error handling
    return this.http.get<Product[]>(`${this.productsUrl}/getAllProducts`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching products:', error.message);
        return throwError('Failed to fetch products, please try again later.');
      })
    );
  }

  // Method to handle add to cart
  // Add this method in AuthService
addToCart(userId: string, productId: string, quantity: number): Observable<any> {
  const token = localStorage.getItem('jwt');

  if (!token) {
    console.error('JWT token not found. Redirecting to login...');
    this.router.navigate(['/login']);
    return throwError('JWT token not found, please login.');
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const body = { userId, productId, quantity };

  return this.http.post(`${this.cartUrl}/addToCart`, body, { headers }).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error adding to cart:', error);
      return throwError('Failed to add to cart, please try again later.');
    })
  );
}

  
  // Fetch product by ID
  getProductById(productId: string): Observable<Product> {
    // Send productId as a parameter in the URL
    const url = `${this.productsUrl}/getProduct?productId=${productId}`;

    return this.http.get<Product>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching product by ID:', error);
        return throwError('Failed to fetch product details, please try again later.');
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem('jwt'); // Remove the JWT token
  }

  getUserName(): string | null {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
      return decodedToken.username; // Adjust this based on your token structure
    }
    return null;
  }

  // Method to get user ID from token
  getUserId(): string | null {
    const token = localStorage.getItem('jwt'); 
    if (token && !this.jwtHelper.isTokenExpired(token)) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        console.log('Decoded Token:', decodedToken); // Debug log
        return decodedToken.userId || null; 
    }
    return null;
  }
}
