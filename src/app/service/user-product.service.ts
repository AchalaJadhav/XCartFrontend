import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserProductService {

  constructor(private http:HttpClient) { }


  loadcategories()
  {
    return this.http.get<any>("http://localhost:8087/getcategories");
  }
}
