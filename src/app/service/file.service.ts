import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  downloadFile() {
    return this.http.get(`http://localhost:8087/download`,{observe:'response',responseType:'arraybuffer'});
  }
}
