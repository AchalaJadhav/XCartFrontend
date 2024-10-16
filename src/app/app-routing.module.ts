import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';

const routes: Routes = 
[
  { path: '', component: HomeComponent}, // Redirect to home on initial load
  { path: 'product/:id', component: ProductDetailComponent }, 
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignUpComponent},
  { path: 'cart/:productId', component: ProductCartComponent},
  { path: 'cart', component: ProductCartComponent }, // Route for /cart without productId
  { path: 'checkout', component: CheckoutPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

