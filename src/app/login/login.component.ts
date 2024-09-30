import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private toastr: ToastrService,private _authService : AuthenticationService, private route : Router) { }
  

  ngOnInit() {
  }

  form = {
    username: '',
    password: '',
  };

  login()
  {
    
    this._authService.login(this.form).subscribe
    ({
      next: (response:any) =>
      {
        this._authService.setSessionStorageAfterLogin(response);
        console.log(response.status)

        if(response.status == true)
        {
          console.log(response)
          if(response.userResponseObject.role == "ROLE_ADMIN")
          {
            //  console.log(response)
            //  console.log('Admin');
            this.toastr.info("Welcome Admin");
            this.route.navigate(["/adminProducts"])
             
          
          }
          if(response.userResponseObject.role == "ROLE_USER")
          { 
            // console.log(response)
            // console.log("User");
           this.toastr.success("Login Successfull");
           this.route.navigate(["/home"])
            
  
          }
        }
        else
        {
          if(response.userResponseObject.userId == -1)
          {
            this.toastr.error("Email Id or Password Wrong");
            //console.log("id password worng")
          }
          if(response.userResponseObject.userId == -2)
          {
            this.toastr.info("Please Sign Up First!");
            //console.log("Not registered user")
          }
        }
      }
      ,
      error: (e:any) => console.error(e), 
    });
  }
}