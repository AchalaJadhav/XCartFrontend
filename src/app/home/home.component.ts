import { Component, OnInit } from '@angular/core';
import { WelcomeService } from '../service/welcome.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private serviceWelcome:WelcomeService) { }

  ngOnInit(): void {
  }
  samp:any = "empty response"

  welcomeHome()
  {
    this.samp = this.serviceWelcome.executeWelcome().subscribe();
    console.log("Loginfuc :"+this.samp );
    this.serviceWelcome.executeWelcome().subscribe(
      response => this.handleSuccessRes(response)
    );
  }
  handleSuccessRes(response:any)
  {
    console.log(response)
  }
}
