import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Custome Created
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatIconModule} from '@angular/material/icon';
import { ProductCartComponent } from './product-cart/product-cart.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';

export function tokenGetter() {
  return localStorage.getItem('token'); // Adjust this if you're using a different storage method
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    SignUpComponent,
    SpinnerComponent,
    ProductDetailComponent,
    ProductCartComponent,
    CheckoutPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,  // Required for Toastr
    ToastrModule.forRoot(),  // Toastr configuration
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:8182'], // Replace with your API domain
        disallowedRoutes: [],
      },
    }),
    MatCardModule,
    MatButtonModule,
    ScrollingModule,
    MatIconModule,
    MatSnackBarModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
