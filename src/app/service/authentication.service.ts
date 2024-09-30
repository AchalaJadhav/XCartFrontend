import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export const TOKEN = 'token';
export const USER_ID = 'userId';
export const FIRST_NAME = 'firstName';
export const ROLE = 'role';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService 
{
  // ans(user)
  // {
  //   return this.http.post("https://localhost:5001/user/security/",user)
  // }

  
  constructor(private http:HttpClient) { }

  // getQuestions() 
  // {
  //   console.log("inside ques service");
  //   return this.http.get("https://localhost:5001/user/question")
  // }

  isAdminAuthenticated(){
    if(sessionStorage.getItem(ROLE)== 'ROLE_ADMIN')
    return true;
    else  
    return false;
  }

  isUserAuthenticated(){
    if(sessionStorage.getItem(ROLE)==  'ROLE_USER')
    return true;
    else  
    return false;
  }

  isAnonymousLoggedIn(){
    if(sessionStorage.getItem(ROLE)== null || sessionStorage.getItem(ROLE)==  "anonymous")
    return true;
    else  
    return false;
  }

  forgotlogin(user:any):Observable<any>
  {
    //console.log(user.EmailId)
    const userbean  = {username:user.username} 
    return this.http.post<any>(`http://localhost:8087/validateUsername`, userbean)
  }
  login(user:any): any{
    // console.log(user.password)
    const userbean  = {username:user.username,password:user.password} 
    return this.http.post<any>(`http://localhost:8087/login`, userbean)
  }

  register(user: any) {
    console.log(user);
    //return null;
    
    return this.http.post(`http://localhost:8087/signup`,user);
  }

  getQuestionAndAnswer(uid: string | null) 
  {
    // console.log("Userid:"+ uid);
    const userbean  = {userId:uid} 
    return this.http.post<any>(`http://localhost:8087/getUserQuestionAnswer`, userbean)
  }
  // details(uid)
  // {
  //   return this.http.get("https://localhost:5001/user/details/"+uid)
  // }

  // ans(user)
  // {
    
  //   return this.http.post("https://localhost:5001/user/security/",user)
  // }

  setSessionStorageAfterLogin(LoginResponse: any)
  {
          sessionStorage.setItem(TOKEN, `Bearer ${LoginResponse.userToken}`);
          sessionStorage.setItem(USER_ID, LoginResponse.userResponseObject.userId);
          sessionStorage.setItem(ROLE, LoginResponse.userResponseObject.role);
          sessionStorage.setItem(FIRST_NAME, LoginResponse.userResponseObject.firstName);
  }

  getQuestions()
  {
    return this.http.get<any>("http://localhost:8087/getquestions");
  }

  updatePasswordAndSecurity(user: any) 
  {
    // const userbean  = {username:username,password:user.value.Password}
    const userbean  = {username:user.username, password:user.password, question:user.question, answer :user.answer} 
    return this.http.post<any>(`http://localhost:8087/updatePasswordAndSecurity`, userbean)
  }

  logout()
  {
    sessionStorage.setItem(TOKEN,'');
    sessionStorage.setItem(USER_ID, "");
    sessionStorage.setItem(ROLE, "anonymous");
    sessionStorage.setItem(FIRST_NAME, "");
  }
}
