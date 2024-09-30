import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {


  constructor(private toastr: ToastrService,private _authService : AuthenticationService, private route : Router) { }
  ngOnInit()
  {  
    // if(sessionStorage.getItem("fpid") == "-1" || sessionStorage.getItem("fpid") == null || sessionStorage.getItem("fpid") == "" )
    // { 
    //   this.toastr.info("fpid issue :- "+ sessionStorage.getItem("fpid"));
    //   this.route.navigate(["/forgetPassword"])
    // }
  }
  PassValid(user: NgForm)
  {
    
    // console.log(user.value)

    this._authService.forgotlogin(user.value)
    .subscribe
    ({
      next: (response:any) =>
      {
          // console.log(response.userResponseObject.userId);
          // console.log("fp res:"+response.responseMessage);
          
        if(response.status == true)
        {
          sessionStorage.setItem("fpid",response.userResponseObject.userId); 
          this.route.navigate(["/resetPassword"])
          

        }
        else
        {          
          this.toastr.info("Please Provide Correct Email Id");
        }
        
      }
      ,
      error: (e:any) => console.error(e)
    });

  }

}
