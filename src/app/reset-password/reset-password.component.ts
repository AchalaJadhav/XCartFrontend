import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../service/authentication.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
 
  constructor(private toastr :ToastrService,private _auth : AuthenticationService, private route : Router) { }
  secng = false;
  sec : any;
  ans : any;
  que : any;
  userhold : any;
  secQuestions : any;
  ngOnInit()
  {   
    this._auth.getQuestionAndAnswer(sessionStorage.getItem("fpid"))
    .subscribe
    ({
      next: (response:any) =>
      {
          // console.log(response);
          // console.log("fp res:"+response.responseMessage);
          
        if(response.status == true)
        {
            this.sec = response;
            this.que = this.sec.userResponseObject.question;
            this.ans = this.sec.userResponseObject.answer;
            this.userhold = this.sec.userResponseObject;
        }
        else
        {          
          this.toastr.info("Please Provide Correct Email Id");
        }
        
      }
      ,
      error: (e:any) => console.error(e)
    });
   
    this._auth.getQuestions().subscribe
    ({
      next: response => {
        // console.log("Response : " + response);
        this.secQuestions = response;
      },
      error: error => {
        console.log("Error Response : " + error);
      }
    });
   
  }

  form = {
    username: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth:'',
    answer: '',
    question:'',
    acceptTerms: false
  };
  //toreset(ans:NgForm)
  toreset(ans:any)
  {
    if(ans.value.answer == this.ans)
    {
      this.toastr.success("Correct Anwer");
      this.secng = true;
      
    }
    else
    {
      this.toastr.info("Answer does not match");
    }
    

  }

  // changed(user:NgForm)
  changed()
  {

    this.form.username = this.userhold.username
    this._auth.updatePasswordAndSecurity(this.form)
    .subscribe
    ({
      next: (response:any) =>
      {
          // console.log(response);
          // console.log("fp res:"+response.responseMessage);
          
        if(response.status == true)
        {
          sessionStorage.setItem("fpid","-1"); 
          this.toastr.success("Details updated succesfullly");
          this.route.navigate(["/login"]);
        }
        else
        {          
          this.toastr.info("Not able to update details");
        }
        
      }
      ,
      error: (e:any) => console.error(e)
    });
   
    this._auth.getQuestions().subscribe
    ({
      next: response => {
        // console.log("Response : " + response);
        this.secQuestions = response;
      },
      error: error => {
        console.log("Error Response : " + error);
      }
    });

  }

}
