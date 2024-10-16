import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  private checkoutData: any;

  constructor() { }

  getCheckoutData(){
    return this.checkoutData
  }

  setCheckoutData(checkoutData: any){
    this.checkoutData = checkoutData;
  }
}
