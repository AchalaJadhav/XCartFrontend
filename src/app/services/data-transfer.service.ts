import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  private checkoutData: any;
  private country!: string;
  private state!: string;
  private cities!: string;
  private talukas!: string;
  private pincode!: any;

  constructor() { }

  getCheckoutData(){
    return this.checkoutData
  }

  setCheckoutData(checkoutData: any){
    this.checkoutData = checkoutData;
  }

  getCountry(){
    return this.country;
  }

  setCountry(country: string){
    this.country = country;
  }

  getState(){
    return this.state;
  }

  setState(state: string){
    this.state = state;
  }

  getCities(){
    return this.cities;
  }

  setCities(cities: string){
    this.cities = cities;
  }

  getTalukas(){
    return this.talukas;
  }

  setTalukas(talukas: string){
    this.talukas = talukas;
  }

  getPincode(){
    return this.pincode;
  }

  setPincode(pincode: any){
    this.pincode = pincode;
  }
}
