import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from  '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  secQuestions: any;

  constructor(private toastr: ToastrService,private _auth:AuthenticationService,private route : Router) { }

  ngOnInit(): void {

    
    this._auth.getQuestions().subscribe
    ({
      next: response => {
        console.log("Response : " + response);
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

  onSubmit(): void {
    console.log(JSON.stringify(this.form, null, 2));
    this._auth.register(this.form).subscribe
    ({
      next: (response:any) =>
      {
        // console.log(response);
        // console.log(response.responseMessage);
        // console.log(response.status);
        if(response.status)
        {
          this.toastr.success("Successfully registered");
          console.log("Successfully registered");
          this.route.navigate(["/login"])
        // this.toster.success("Try Another Email");
        // this.toster.error("Email Id Allready Exists");
        // this.toster.info("Cant Sign Up");
        }
        else
        {
          this.toastr.info("Email id already exists");
          console.log("Email id already exists");
        }
      }
      ,
      error: (e:any) => 
      {
        console.error(e)
        this.toastr.error("Error occured");
      }, 
    });

  }

  onReset(form: NgForm): void {
    form.reset();
  }
}
