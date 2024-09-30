import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { FileService } from '../service/file.service';
import { UserProductService } from '../service/user-product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  blob: Blob | undefined;
  user: any = 'userBro';
  loggedInUser: any;
  categories: any;
  
  
  constructor(public _auth:AuthenticationService,private userProductService : UserProductService, private route : Router,private fileService : FileService) { }

  ngOnInit(): void {

    this.userProductService.loadcategories().subscribe
    ({
      next: response => {
        // console.log("Response : " + response);
        this.categories = response;
      },
      error: error => {
        console.log("Error Response : " + error);
      }
    });
    this.user = sessionStorage.getItem('firstName');
  }

  search(tag : NgForm)
  {
    
    // console.log(tag.value.ProductName);
    // this.route.navigate(["/search",tag.value.ProductName])
    
  }
  


  logout()
  {
    this._auth.logout();
    //this.route.navigate(["/home"]);

  }

  downloadFile() {
    this.fileService.downloadFile().subscribe({
      next: response => {
        if (response && response.body && response.headers) {
          this.blob = new Blob([response.body as any], { type: 'application/octet-stream' });
          let downloadURL = window.URL.createObjectURL(this.blob);
          let link = document.createElement('a');
          link.href = downloadURL;
          link.download = response.headers.get('content-disposition')?.split(';')[1].split('=')[1] as string;
          link.click();
        }
      },
      error: error => {
        console.log("Error response : " + error.error);
      }
    });
  }

}
