import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Product } from '../product/product.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8182/auth';  // Base URL for your authentication API
  private productsUrl = 'http://localhost:8182/product'; // Base URL for getting products
  private cartUrl = 'http://localhost:8182/cart'; // Base URL for cart functionality

  constructor(private http: HttpClient,
              private router: Router
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
        // Assuming the JWT token is returned in the 'token' field of the response
        const token = response.token;  
        if (token) {
          // Store the token in localStorage for future requests
          localStorage.setItem('jwt', token);
        }
      })
    );
}


  // Get all products method
  // getProducts(): Observable<Product[]> {
  //   // Retrieve the token from localStorage
  //   const token = localStorage.getItem('jwt');
  
  //   // Check if token exists, if not, handle it (e.g., redirect to login or throw an error)
  //   if (!token) {
  //     console.error('JWT token not found. Redirecting to login...');
  //     // Handle appropriately; example: you can redirect or throw an error
  //     this.router.navigate(['/login']); // Redirecting to login in case of missing token
  //     return throwError('JWT token not found, please login.');
  //   }
  
  //   // Add the token to the Authorization header
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  //   // Log the token only for debugging purposes (optional)
  //   console.log('JWT token:', token);
  
  //   // Perform the API call to get the products
  //   return this.http.get<Product[]>(`${this.productsUrl}/getproducts`, { headers }).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       console.error('Error fetching products:', error);
  //       return throwError('Failed to fetch products, please try again later.');
  //     })
  //   );
  // }
  
  getProducts(): Observable<Product[]> {
    // No token retrieval or Authorization header required here
    
    // Perform the API call to get the products
    return this.http.get<Product[]>(`${this.productsUrl}/getAllProducts`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching products:', error);
        return throwError('Failed to fetch products, please try again later.');
      })
    );
  }

  // Method to handle add to cart
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
  
  
}