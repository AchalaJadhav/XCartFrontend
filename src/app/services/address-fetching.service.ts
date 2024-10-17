import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressFetchingService {

  
  private userAddressUrl = 'http://localhost:8182/useraddress'; // Base URL for user address functionality
  private addressUrl = 'http://localhost:8182/address'; // Base URL for address functionality
  
  constructor(private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  // Add user address while checkout
  addUserAddress(userId: string, userAddresses: any[]): Observable<any> {
    const token = localStorage.getItem('jwt');
  
    if (!token) {
      console.error('JWT token not found. Redirecting to login...');
      this.router.navigate(['/login']);
      return throwError('JWT token not found, please login.');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Ensure your token is included
      'Content-Type': 'application/json'
    });
    const body = { userId, userAddresses};
    console.log("From Auth: " + userId, userAddresses);
  
    return this.http.post(`${this.userAddressUrl}/addUserAddress`, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding to cart:', error);
        return throwError('Failed to add to cart, please try again later.');
      })
    );
  }

  //get all addresses by userId
  getAddressById(userId: string): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (!token) {
        console.error('JWT token not found. Redirecting to login...');
        this.router.navigate(['/login']);
        return throwError('JWT token not found, please login.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.userAddressUrl}/get/${userId}`; // Append parameters to the URL

    return this.http.get(url, { headers }).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error fetching cart:', error);
            return throwError('Failed to fetch cart, please try again later.');
        })
    );
  }

  //get all countries
  getCountries(): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (!token) {
        console.error('JWT token not found. Redirecting to login...');
        this.router.navigate(['/login']);
        return throwError('JWT token not found, please login.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.addressUrl}/countries`; // Append parameters to the URL

    return this.http.get(url, { headers }).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error fetching cart:', error);
            return throwError('Failed to fetch cart, please try again later.');
        })
    );
  }

  //get all states
  getStates(country: string): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (!token) {
        console.error('JWT token not found. Redirecting to login...');
        this.router.navigate(['/login']);
        return throwError('JWT token not found, please login.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.addressUrl}/states?country=${country}`; // Append parameters to the URL

    return this.http.get(url, { headers }).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error fetching cart:', error);
            return throwError('Failed to fetch cart, please try again later.');
        })
    );
  }

  getCities(state: string): Observable<any> {
    const token = localStorage.getItem('jwt');
  
    if (!token) {
      console.error('JWT token not found. Redirecting to login...');
      this.router.navigate(['/login']);
      return throwError('JWT token not found, please login.');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.addressUrl}/cities?state=${state}`;
  
    return this.http.get(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching cities:', error);
        return throwError('Failed to fetch cities, please try again later.');
      })
    );
  }

  getTalukas(city: string): Observable<any> {
    const token = localStorage.getItem('jwt');
  
    if (!token) {
      console.error('JWT token not found. Redirecting to login...');
      this.router.navigate(['/login']);
      return throwError('JWT token not found, please login.');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.addressUrl}/talukas?city=${city}`;
  
    return this.http.get(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching talukas:', error);
        return throwError('Failed to fetch talukas, please try again later.');
      })
    );
  }

  getPincodes(city: string): Observable<any> {
    const token = localStorage.getItem('jwt');
  
    if (!token) {
      console.error('JWT token not found. Redirecting to login...');
      this.router.navigate(['/login']);
      return throwError('JWT token not found, please login.');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.addressUrl}/pincodes?city=${city}`;
  
    return this.http.get(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching pincodes:', error);
        return throwError('Failed to fetch pincodes, please try again later.');
      })
    );
  }

  updateUserAddress(userId: string, updatedAddress: any): Observable<any> {
    const token = localStorage.getItem('jwt');
  
    if (!token) {
      console.error('JWT token not found. Redirecting to login...');
      this.router.navigate(['/login']);
      return throwError('JWT token not found, please login.');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.userAddressUrl}/update/${userId}`;
  
    return this.http.put(url, updatedAddress, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating address:', error);
        return throwError('Failed to update address, please try again later.');
      })
    );
  }

  deleteUserAddress(userId: string, addressId: string): Observable<any> {
    const token = localStorage.getItem('jwt');
  
    if (!token) {
      console.error('JWT token not found. Redirecting to login...');
      this.router.navigate(['/login']);
      return throwError('JWT token not found, please login.');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.userAddressUrl}/delete/${userId}/${addressId}`;
  
    return this.http.delete(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting address:', error);
        return throwError('Failed to delete address, please try again later.');
      })
    );
  }
    
}
